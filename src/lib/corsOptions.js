const whitelists = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://ot-25.vercel.app",
  "https://owerritechies.com",
  "https://owerritechies.com",
  "https://www.owerritechies.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    const localhostSubdomainRegex =
      /^http?:\/\/([a-z0-9-]+\.)*localhost:517[3-8]$/;
    if (
      !origin ||
      whitelists.includes(origin) ||
      localhostSubdomainRegex.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};

module.exports = corsOptions;
