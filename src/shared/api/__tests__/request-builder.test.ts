import { describe, it, expect } from "vitest";
import { request as buildQueryString } from "@/shared/api/http-client";

describe("request-builder", () => {
    it("builds query string with non-empty values", () => {
        //@ts-ignore
        const qs = buildQueryString({
            page: 1,
            status: "Active",
            empty: "",
            nullVal: null,
            undefVal: undefined,
        });
        expect(qs).toContain("page=1");
        expect(qs).toContain("status=Active");
        expect(qs).not.toContain("empty=");
        expect(qs).not.toContain("nullVal=");
        expect(qs).not.toContain("undefVal=");
    });

    it("returns empty string for empty params", () => {
        //@ts-ignore
        const qs = buildQueryString({ a: undefined, b: null, c: "" });
        expect(qs).toBe("");
    });

    it("handles boolean values", () => {
        //@ts-ignore
        const qs = buildQueryString({ is_available: true });
        expect(qs).toBe("is_available=true");
    });
});
