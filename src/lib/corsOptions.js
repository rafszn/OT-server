const corsOptions = {
  origin: function (origin, callback) {
    const localhostSubdomainRegex =
      /^http?:\/\/([a-z0-9-]+\.)*localhost:517[3-8]$/;
    if (!origin || localhostSubdomainRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true,
};

module.exports = corsOptions;
