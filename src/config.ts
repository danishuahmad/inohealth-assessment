export const API_URL =
  import.meta.env.MODE === "development"
    ? "/api" // 👈 local proxy path
    : "https://mockapi-furw4tenlq-ez.a.run.app"; // 👈 live backend URL
