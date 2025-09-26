import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { z } from "zod";

const router = Router();

const postSchema = z.object({
	content: z.string().min(1).max(1000),
});

const commentSchema = z.object({
	content: z.string().min(1).max(500),
});

// Get all community posts
router.get("/posts", async (req, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('community_posts')
			.select(`
				id,
				content,
				likes,
				created_at,
				updated_at,
				profiles!inner(
					id,
					username,
					level
				)
			`)
			.order('created_at', { ascending: false })
			.limit(50);

		if (error) {
			console.error('Error fetching community posts:', error);
			return res.status(500).json({ error: "Failed to fetch community posts" });
		}

		const posts = (data || []).map((post: any) => ({
			id: post.id,
			content: post.content,
			likes: post.likes || 0,
			createdAt: post.created_at,
			updatedAt: post.updated_at,
			author: {
				id: post.profiles.id,
				username: post.profiles.username || `User${post.profiles.id.slice(0, 6)}`,
				level: post.profiles.level || 1
			}
		}));

		res.json({ posts });
	} catch (error) {
		console.error('Community posts error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Create new community post
router.post("/posts", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const parsed = postSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
		}

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { content } = parsed.data;

		const { data, error } = await supabaseAdmin
			.from('community_posts')
			.insert({
				user_id: req.userId!,
				content,
				likes: 0,
			})
			.select(`
				id,
				content,
				likes,
				created_at,
				profiles!inner(
					id,
					username,
					level
				)
			`)
			.single();

		if (error) {
			console.error('Error creating community post:', error);
			return res.status(500).json({ error: "Failed to create community post" });
		}

		const post = {
			id: data.id,
			content: data.content,
			likes: data.likes || 0,
			createdAt: data.created_at,
			author: {
				id: (data as any).profiles.id,
				username: (data as any).profiles.username || `User${(data as any).profiles.id.slice(0, 6)}`,
				level: (data as any).profiles.level || 1
			}
		};

		res.status(201).json({ post });
	} catch (error) {
		console.error('Create community post error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Like/unlike a post
router.post("/posts/:postId/like", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const { postId } = req.params;

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Get current post
		const { data: post, error: postError } = await supabaseAdmin
			.from('community_posts')
			.select('likes')
			.eq('id', postId)
			.single();

		if (postError || !post) {
			return res.status(404).json({ error: "Post not found" });
		}

		// Increment likes
		const { data, error } = await supabaseAdmin
			.from('community_posts')
			.update({
				likes: (post.likes || 0) + 1,
			})
			.eq('id', postId)
			.select('likes')
			.single();

		if (error) {
			console.error('Error liking post:', error);
			return res.status(500).json({ error: "Failed to like post" });
		}

		res.json({ likes: data.likes });
	} catch (error) {
		console.error('Like post error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Delete a post (only by author)
router.delete("/posts/:postId", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const { postId } = req.params;

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Check if user owns the post
		const { data: post, error: postError } = await supabaseAdmin
			.from('community_posts')
			.select('user_id')
			.eq('id', postId)
			.single();

		if (postError || !post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.user_id !== req.userId) {
			return res.status(403).json({ error: "Not authorized to delete this post" });
		}

		// Delete the post
		const { error } = await supabaseAdmin
			.from('community_posts')
			.delete()
			.eq('id', postId);

		if (error) {
			console.error('Error deleting post:', error);
			return res.status(500).json({ error: "Failed to delete post" });
		}

		res.json({ message: "Post deleted successfully" });
	} catch (error) {
		console.error('Delete post error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get communities
router.get("/communities", async (req, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('communities')
			.select('*')
			.order('member_count', { ascending: false });

		if (error) {
			console.error('Error fetching communities:', error);
			return res.status(500).json({ error: "Failed to fetch communities" });
		}

		res.json({ communities: data || [] });
	} catch (error) {
		console.error('Communities error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Join a community
router.post("/communities/:communityId/join", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const { communityId } = req.params;

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Check if already a member
		const { data: existingMember } = await supabaseAdmin
			.from('community_members')
			.select('id')
			.eq('user_id', req.userId!)
			.eq('community_id', communityId)
			.single();

		if (existingMember) {
			return res.status(400).json({ error: "Already a member of this community" });
		}

		// Join the community
		const { data, error } = await supabaseAdmin
			.from('community_members')
			.insert({
				user_id: req.userId!,
				community_id: communityId,
			})
            .select()
            .single();

		if (error) {
			console.error('Error joining community:', error);
			return res.status(500).json({ error: "Failed to join community" });
		}

		// Update member count
		const { error: countError } = await supabaseAdmin.rpc('increment', {
			table_name: 'communities',
			column_name: 'member_count',
			row_id: communityId,
			amount: 1
		});

		if (countError) {
			console.error('Error updating member count:', countError);
		}

		res.status(201).json({ message: "Successfully joined community" });
	} catch (error) {
		console.error('Join community error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Leave a community
router.post("/communities/:communityId/leave", requireAuth, async (req: AuthedRequest, res) => {
	try {
		const { communityId } = req.params;

		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		// Leave the community
		const { error } = await supabaseAdmin
			.from('community_members')
			.delete()
			.eq('user_id', req.userId!)
			.eq('community_id', communityId);

		if (error) {
			console.error('Error leaving community:', error);
			return res.status(500).json({ error: "Failed to leave community" });
		}

		// Update member count
		const { error: countError } = await supabaseAdmin.rpc('increment', {
			table_name: 'communities',
			column_name: 'member_count',
			row_id: communityId,
			amount: -1
		});

		if (countError) {
			console.error('Error updating member count:', countError);
		}

		res.json({ message: "Successfully left community" });
	} catch (error) {
		console.error('Leave community error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

// Get user's communities
router.get("/my-communities", requireAuth, async (req: AuthedRequest, res) => {
	try {
		if (!supabaseAdmin) {
			return res.status(500).json({ error: "Supabase not configured" });
		}

		const { data, error } = await supabaseAdmin
			.from('community_members')
			.select(`
				communities!inner(
					id,
					name,
					description,
					member_count
				)
			`)
			.eq('user_id', req.userId!);

		if (error) {
			console.error('Error fetching user communities:', error);
			return res.status(500).json({ error: "Failed to fetch communities" });
		}

		const communities = (data || []).map(member => member.communities);

		res.json({ communities });
	} catch (error) {
		console.error('My communities error:', error);
		res.status(500).json({ error: "Internal server error" });
	}
});

export default router;
