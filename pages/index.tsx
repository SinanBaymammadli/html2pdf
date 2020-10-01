import { ChangeEvent } from "react";
import axios from "axios";
import PDFViewer from "pdf-viewer-reactjs";
import { useMutation } from "react-query";
import debounce from "lodash/debounce";
import { testHtml } from "../utils/test";

function request(html: string) {
  return axios.post("/api/hello", { html });
}

export default function Home() {
  const [getPdf, pdfResult] = useMutation(request);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    getPdf(e.target.value);
  }

  return (
    <div>
      <textarea
        onChange={debounce(handleChange, 300)}
        rows={20}
        cols={100}
        defaultValue={testHtml}
      />

      {pdfResult.isSuccess && (
        <PDFViewer
          document={{
            base64: pdfResult.data.data.pdf,
          }}
        />
      )}
    </div>
  );
}
