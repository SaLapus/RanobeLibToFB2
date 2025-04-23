import { describe, expect, it, vi } from "vitest";
import { TitleInfo } from "../../types/api/Title";
import { XMLNode } from "../../utils/parseChapters";
import printBook from "../../utils/printBook";

// Mock URL and document methods
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
URL.createObjectURL = mockCreateObjectURL;
URL.revokeObjectURL = mockRevokeObjectURL;

describe("printBook", () => {
  const mockTitleInfo: TitleInfo = {
    id: 1,
    eng_name: "Test Novel",
    authors: [{ name: "John Doe" }],
  } as TitleInfo;

  const mockChapters: XMLNode[] = [
    {
      section: {
        "#": [
          { title: { "#": "Chapter 1" } },
          { p: { "#": [{ strong: { "#": "Test content" } }] } },
        ],
      },
    },
  ];

  const mockBinary: XMLNode[] = [
    {
      binary: {
        "@": {
          id: "test-image",
          "content-type": "image/jpeg",
        },
        "#": "base64data",
      },
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = "";
    mockCreateObjectURL.mockReset();
    mockRevokeObjectURL.mockReset();
    mockCreateObjectURL.mockReturnValue("blob:test-url");
  });

  it("generates FB2 file with correct structure", () => {
    printBook(mockTitleInfo, "1", mockChapters);

    // Verify Blob was created with correct XML structure
    expect(mockCreateObjectURL).toHaveBeenCalled();
    const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blobCall).toBeInstanceOf(Blob);
    expect(blobCall.type).toBe("application/fb2");
  });

  it("handles binary attachments correctly", () => {
    printBook(mockTitleInfo, "1", mockChapters, mockBinary);

    // Verify binary data was included
    const blobCall = mockCreateObjectURL.mock.calls[0][0] as Blob;
    expect(blobCall.type).toBe("application/fb2");

    // Convert Blob to text to verify content
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      expect(content).toContain("base64data");
      expect(content).toContain('content-type="image/jpeg"');
    };
    reader.readAsText(blobCall);
  });

  it("cleans up resources after file creation", () => {
    printBook(mockTitleInfo, "1", mockChapters);

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:test-url");
    expect(document.querySelector("a")).toBeNull();
  });
});
