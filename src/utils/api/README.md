
# API Documents

### File Tree

```
/api
  /account
    /fetch.ts
      - fetch_author_data
      - fetch_username_from_account
    /push.ts
      - create_user_account
      - delete_account
      - update_username
      - update_community_badge
  /community
    /fetch.ts
      - fetch_community_posts
    /push.ts
      - add_project_like
  /external
    /pool-pm.ts
      - get_pool_pm_asset
      - get_pool_pm_adahandle
  /forums
    /fetch.ts
      - fetch_all_forum_posts_with_comments
      - fetch_forum_post_with_comments
      - fetch_chat_posts
    /push.ts
      - create_post
      - toggle_vote
      - like_unlike_post
  /misc.ts
    - fetch_finbyte_general_stats
    - create_notification
  /mod.ts
    - delete_post
```

All types and interfaces are in `types.ts` and `interfaces.ts`. All external APIs contain their type safty within the file.

**Note 1:** /forums/push.ts/create_post can create a post for all types, maybe we move this.
**Note 2:** /forums/push.ts/like_unlike_post can handle the action for all types, maybe we move this.



## TODO
- Refactor some of the external functions