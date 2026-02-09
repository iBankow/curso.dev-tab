import { InternalServerError } from "infra/errors";
import authorization from "models/authorization";

describe("models/authorization", () => {
  describe(".can()", () => {
    test("without `user`", () => {
      expect(() => authorization.can()).toThrow(InternalServerError);
    });
    test("without `user.feature`", () => {
      const createdUser = { username: "UserWithountFeatures" };

      expect(() => authorization.can(createdUser)).toThrow(InternalServerError);
    });
    test("without unknown `feature`", () => {
      const createdUser = { features: [] };

      expect(() => authorization.can(createdUser, "unknown:feature")).toThrow(
        InternalServerError,
      );
    });
    test("with valid user and known `feature`", () => {
      const createdUser = { features: ["create:user"] };

      expect(authorization.can(createdUser, "create:user")).toBe(true);
    });
  });

  describe(".filterOutput()", () => {
    test("without `user`", () => {
      expect(() => authorization.filterOutput()).toThrow(InternalServerError);
    });
    test("without `user.feature`", () => {
      const createdUser = { username: "UserWithountFeatures" };

      expect(() => authorization.filterOutput(createdUser)).toThrow(
        InternalServerError,
      );
    });
    test("without unknown `feature`", () => {
      const createdUser = { features: [] };

      expect(() =>
        authorization.filterOutput(createdUser, "unknown:feature"),
      ).toThrow(InternalServerError);
    });
    test("with valid `user`, known feature but no `feature`", () => {
      const createdUser = { features: ["read:user"] };

      expect(() =>
        authorization.filterOutput(createdUser, "read:user"),
      ).toThrow(InternalServerError);
    });

    test("with valid `user`, known `feature` and `resource`", () => {
      const createdUser = { features: ["read:user"] };

      const resource = {
        id: 1,
        username: "resource",
        email: "resource@resource.com",
        password: "resource",
        features: ["read:user"],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const result = authorization.filterOutput(
        createdUser,
        "read:user",
        resource,
      );

      expect(result).toEqual({
        id: 1,
        username: "resource",
        features: ["read:user"],
        created_at: resource.created_at,
        updated_at: resource.updated_at,
      });
    });
  });
});
