var str = "testing commit to master!";

const resolvers = {
    Query: {
      testString: () => {
        return str;
      },
    },
    Mutation: {
        testString: (obj, args, context) => {
            str = args.s;
            return str;
        }
    }
  };

module.exports = resolvers;
