import { create } from "zustand";
import axios from "axios";
import { devtools, persist } from "zustand/middleware";

const useUserProfilePostsStore = create(
  devtools(
    persist(
      (set, get) => ({
        posts: [],
        loading: false,
        error: null,
        hasMore: true,
        page: 1,
        cache: {},

        fetchPosts: async (username) => {
          try {
            set({ loading: true });

            // Check cache first
            const cacheKey = `${username}-posts`;
            if (
              get().cache[cacheKey] &&
              get().cache[cacheKey].timestamp > Date.now() - 5 * 60 * 1000
            ) {
              set({
                posts: get().cache[cacheKey].data,
                loading: false,
                error: null,
              });
              return;
            }

            const response = await axios.get(
              `${import.meta.env.VITE_API_BASE_URL}/userposts/${username}`,
              {
                headers: {
                  Authorization: localStorage.getItem("token"),
                },
              }
            );

            const newPosts = response.data.posts;

            // Update cache with timestamp
            set((state) => ({
              posts: newPosts,
              loading: false,
              error: null,
              cache: {
                ...state.cache,
                [cacheKey]: {
                  data: newPosts,
                  timestamp: Date.now(),
                },
              },
            }));
          } catch (error) {
            set({
              error: error.message,
              loading: false,
            });
          }
        },

        // Update a single post
        updatePost: (postId, updatedData) => {
          set((state) => ({
            posts: state.posts.map((post) =>
              post._id === postId ? { ...post, ...updatedData } : post
            ),
          }));
        },

        // Add a new post to the top
        addPost: (newPost) => {
          set((state) => ({
            posts: [newPost, ...state.posts],
          }));
        },

        // Delete a post
        deletePost: (postId) => {
          set((state) => ({
            posts: state.posts.filter((post) => post._id !== postId),
          }));
        },

        // Clear everything
        clearStore: () => {
          set({
            posts: [],
            loading: false,
            error: null,
            hasMore: true,
            page: 1,
            cache: {},
          });
        },
      }),
      {
        name: "user-profile-posts-store",
        partialize: (state) => ({
          posts: state.posts,
          cache: state.cache,
        }),
      }
    )
  )
);

export default useUserProfilePostsStore;
