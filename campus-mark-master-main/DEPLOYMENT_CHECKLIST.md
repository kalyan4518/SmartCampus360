# SmartCampus 360 Deployment Checklist

1. Install dependencies from the frontend folder with `npm install`.
2. Confirm the backend is running locally or deployed before testing the frontend.
3. Set `VITE_API_URL` to your backend origin in Vercel.
4. If the backend is deployed separately, add your Vercel frontend URL to the backend `CLIENT_URL` setting.
5. Use `npm run build` in `campus-mark-master-main` and make sure it finishes with no warnings or errors.
6. In Vercel, set the project root to `campus-mark-master-main`.
7. Use the default Vite build output directory: `dist`.
8. Keep `vercel.json` in the frontend root so deep links rewrite to `index.html`.
9. After deployment, test these routes directly in the browser:
   `/`
   `/auth`
   `/student`
   `/faculty`
   `/admin`
   `/events`
   `/announcements`
   `/resources`
   `/feedback`
   `/polls`
   `/lost-found`
   `/clubs`
10. Verify dummy logins still work:
    Student: `student@klh.edu` / `1234`
    Faculty: `faculty@test.com` / `1234`
    Admin: `admin@test.com` / `1234`
11. Verify create, delete, join, RSVP, vote, and download flows against the deployed backend.
