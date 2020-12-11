import { IncomingHttpHeaders, ServerResponse, IncomingMessage } from "http";
export type Context = {
  method: string;
  headers: IncomingHttpHeaders & Record<string, string | string[]>;
  path: string;
  params: Record<string, string>;
  payload: unknown;
  query: URLSearchParams;
  raw: {
    request: IncomingMessage,
    response: ServerResponse
  }
};

export class Helper {
  res: ServerResponse;
  private _status = 200;
  constructor(res: ServerResponse) {
    this.res = res;
  }

  setHeader(key: string, value: string | number | string[]) {
    this.res.setHeader(key, value);
  }
  status(status: number) {
    this._status = status;
  }

  json(object: Record<string, unknown>): string {
    this.res.setHeader("Content-Type", "application/json");
    return JSON.stringify(object);
  }

  type(mime: string) {
    this.setHeader("Content-Type", this.lookupMime(mime));
  }

  buildConfig() {
    this.res.writeHead(this._status);
  }

  private lookupMime(mime: string): string | undefined {
    const normalized = mime.startsWith(".") ? mime : "." + mime;
    // Simplied mime table, with most common formats
    const mimeTable: Record<string, string> = {
      ".aac": "audio/aac",
      ".abw": "application/x-abiword",
      ".arc": "application/x-freearc",
      ".avi": "video/x-msvideo",
      ".azw": "application/vnd.amazon.ebook",
      ".bin": "application/octet-stream",
      ".bmp": "image/bmp",
      ".bz": "application/x-bzip",
      ".bz2": "application/x-bzip2",
      ".csh": "application/x-csh",
      ".css": "text/css",
      ".csv": "text/csv",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".eot": "application/vnd.ms-fontobject",
      ".epub": "application/epub+zip",
      ".gz": "application/gzip",
      ".gif": "image/gif",
      ".html": "text/html",
      ".ico": "image/vnd.microsoft.icon",
      ".ics": "text/calendar",
      ".jar": "application/java-archive",
      ".jpg": "image/jpeg",
      ".js": "",
      ".json": "application/json",
      ".jsonld": "application/ld+json",
      ".midi": "audio/midi audio/x-midi",
      ".mjs": "text/javascript",
      ".mp3": "audio/mpeg",
      ".mpeg": "video/mpeg",
      ".mpkg": "application/vnd.apple.installer+xml",
      ".odp": "application/vnd.oasis.opendocument.presentation",
      ".ods": "application/vnd.oasis.opendocument.spreadsheet",
      ".odt": "application/vnd.oasis.opendocument.text",
      ".oga": "audio/ogg",
      ".ogv": "video/ogg",
      ".ogx": "application/ogg",
      ".opus": "audio/opus",
      ".otf": "font/otf",
      ".png": "image/png",
      ".pdf": "application/pdf",
      ".php": "application/x-httpd-php",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".rar": "application/vnd.rar",
      ".rtf": "application/rtf",
      ".sh": "application/x-sh",
      ".svg": "image/svg+xml",
      ".swf": "application/x-shockwave-flash",
      ".tar": "application/x-tar",
      ".tiff": "image/tiff",
      ".ts": "video/mp2t",
      ".ttf": "font/ttf",
      ".txt": "text/plain",
      ".vsd": "application/vnd.visio",
      ".wav": "audio/wav",
      ".weba": "audio/webm",
      ".webm": "video/webm",
      ".webp": "image/webp",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".xhtml": "application/xhtml+xml",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xml":
        "application/xml if not readable from casual users (RFC 3023, section 3)",
      ".xul": "application/vnd.mozilla.xul+xml",
      ".zip": "application/zip",
      ".3gp": "video/3gpp",
      ".3g2": "video/3gpp2",
      ".7z": "application/x-7z-compressed"
    };
    return mimeTable[normalized]
  }
}
