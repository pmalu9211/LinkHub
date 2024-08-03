import { Hono } from "hono";
import { getPrisma } from "../../lib/prisma";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { getQueryParam, getQueryParams } from "hono/utils/url";

interface Bindings {
  DATABASE_URL: string;
  JWT_SECRET: string;
}

interface Variables {
  userId: number;
}

const post = new Hono<{ Bindings: Bindings; Variables: Variables }>();

post.get("/posts", async (c) => {
  try {
    const authHeader = getCookie(c, "token");
    if (authHeader) {
      const user = await verify(authHeader, c.env.JWT_SECRET);
      if (user.id) {
        console.log("Authenticated user ID:", user.id);
        c.set("userId", Number(user.id));
      }
    }

    const prisma = getPrisma(c.env.DATABASE_URL);
    const currentUserId = c.get("userId") || -1;
    console.log(currentUserId);

    let numberOfPosts = 10;
    let page = 1;
    page = Number(getQueryParam(c.req.url, "page"));
    let sortBy = String(getQueryParam(c.req.url, "sortBy")) || "votes";
    let orderBy = String(getQueryParam(c.req.url, "orderBy")) || "descending";

    console.log(page, sortBy, String(getQueryParam(c.req.url, "orderBy")));

    if (page < 1) {
      page = 1;
    }

    let orderByClause = "";

    if (sortBy === "time") {
      orderByClause = `p."createdAt" `;
    } else {
      orderByClause = `COALESCE(v."voteCount" :: int, 0) `;
    }

    if (orderBy === "ascending") {
      orderByClause += `DESC`;
    } else {
      orderByClause += `ASC`;
    }

    console.log(orderByClause);

    const posts = await prisma.$queryRawUnsafe<any>(`
    SELECT
      p."createdAt" :: timestamp,
      p.id :: int,
      p.title,
      p.link,
      p."userId" :: int,
      COALESCE(v."voteCount" :: int, 0) as "voteCount",
      uv.value :: int as "userVote"
    FROM 
      "Post" p
    LEFT JOIN 
      (SELECT "postId", SUM(value) :: int as "voteCount"
       FROM "Vote"
       GROUP BY "postId") v ON p.id = v."postId"
    LEFT JOIN
      "Vote" uv ON p.id = uv."postId" AND uv."userId" = ${currentUserId}
    ORDER BY 
      ${orderByClause}
    LIMIT ${numberOfPosts} OFFSET ${(page - 1) * numberOfPosts}
  `);

    const totalPosts = await prisma.post.aggregate({
      _count: {
        id: true,
      },
    });

    const totalPages = Math.ceil(totalPosts._count.id / 10);
    console.log("totalPages: ", totalPages);
    c.status(200);
    return c.json({ message: "Hello Hono!", posts, totalPages });
  } catch (e: any) {
    c.status(500);
    return c.json({ message: e.message });
  }
});

post.use("*", async (c, next) => {
  const authHeader = getCookie(c, "token");
  if (!authHeader) {
    c.status(401);
    return c.json({ message: "Please log in" });
  }
  try {
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user.id) {
      console.log("Authenticated user ID:", user.id);
      c.set("userId", Number(user.id));
      await next();
    } else {
      return c.json({ message: "You are not logged in" }, 401);
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ message: "Authentication failed" }, 401);
  }
});

post.post("/upload", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  // const body = await c.req.parseBody();
  const body = await c.req.formData();
  const title = body.get("title") as string;
  const link = body.get("link") as string;
  const userId = c.get("userId");

  console.log(body);

  if (!title) {
    c.status(422);
    return c.json({ message: "title is required" });
  }
  if (!link) {
    c.status(422);
    return c.json({ message: "link is required" });
  }

  try {
    const res = await prisma.post.create({
      data: {
        title: title,
        link: link,
        userId: Number(userId),
      },
    });
    return c.json({ message: "Post Created", res });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ message: "went wrong" });
  }
});

post.put("/vote/:id", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  const Sid = c.req.param("id");
  const id = Number(Sid);

  try {
    if ((!body.value && body.value != 0) || body.value > 1 || body.value < -1) {
      c.status(422);
      return c.json({
        message: "Value should be between -1 and 1",
        value: body.value,
      });
    }

    if (!id) {
      c.status(422);
      return c.json({ message: " invalid id input" });
    }

    const res = await prisma.post.findFirst({
      where: {
        id,
      },
    });

    if (!res) {
      c.status(422);
      return c.json({ message: "post not found" });
    }

    const voted = await prisma.vote.findFirst({
      where: {
        postId: id,
        userId: c.get("userId"),
      },
    });

    if (voted) {
      await prisma.vote.update({
        where: {
          id: voted.id,
        },
        data: {
          value: body.value,
        },
      });
    } else {
      await prisma.vote.create({
        data: {
          postId: id,
          userId: c.get("userId"),
          value: body.value,
        },
      });
    }
    return c.json({ message: "Voted successfully" });
  } catch (e) {
    console.log(e);
    c.status(500);
    return c.json({ message: "went wrong" });
  }
});

export default post;

////Dumpyard

// const postsWithVoteSum = await prisma.post.findMany({
//   include: {
//     // _count: {
//     //   select: {
//     //     votes: true,
//     //   },
//     // },
//     votes: {
//       select: {
//         value: true,
//       },
//     },
//   },
// });

// const postsWithTotalVotes = postsWithVoteSum.map((post) => {
//   const totalVotes = post.votes.reduce((acc, vote) => acc + vote.value, 0);
//   return {
//     ...post,
//     totalVotes,
//   };
// });

// console.log(postsWithTotalVotes);

// post.post("/downvote", async (c) => {
//   const prisma = getPrisma(c.env.DATABASE_URL);
//   const body = await c.req.json();
//   const Sid = body.id as string;
//   const id = Number(Sid);

//   console.log(body);

//   if (!id) {
//     return c.json({ message: " invalid id input" });
//   }

//   const res = await prisma.post.findFirst({
//     where: {
//       id,
//     },
//   });

//   if (!res) {
//     return c.json({ message: "post not found" });
//   }

//   const voted = await prisma.vote.findFirst({
//     where: {
//       postId: id,
//       userId: c.get("userId"),
//     },
//   });
//   let data;
//   if (voted) {
//     data =
//       voted?.value === -1
//         ? await prisma.vote.delete({ where: { id: voted.id } })
//         : await prisma.vote.update({
//             where: { id: voted.id },
//             data: { value: -1 },
//           });
//   } else {
//     data = await prisma.vote.create({
//       data: {
//         postId: id,
//         userId: c.get("userId"),
//         value: -1,
//       },
//     });
//   }

//   try {
//     return c.json({ message: "Downvoted", data });
//   } catch (e) {
//     console.log(e);
//     c.status(500);
//     return c.json({ message: "Something went wrong" });
//   }
// });
