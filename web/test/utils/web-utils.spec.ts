import { getUrlParams } from "utils/web-utils";

describe("getUrlParams", () => {
  it("should parse multiple params", () => {
    const params = getUrlParams("blah?any=thing&some=another");

    expect(params).toEqual({ any: "thing", some: "another" });
  });

  it("should handle full url", () => {
    const params = getUrlParams("https://blah.com?any=thing&some=another");

    expect(params).toEqual({ any: "thing", some: "another" });
  });

  it("should handle no params", () => {
    const params = getUrlParams("https://blah.com");

    expect(params).toEqual({});
  });

  it("should handle values with + in it", () => {
    const params = getUrlParams("https://blah.com?any+thing=my+thing&some=another");

    expect(params).toEqual({ "any thing": "my thing", some: "another" });
  });
});
