import { appServices } from "@/service/appService";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import type EventInfo from "@ckeditor/ckeditor5-utils/src/eventinfo";
import classNames from "classnames";

import styles from "./styles.module.scss";

type Props = {
  disabled?: boolean;
  data?: string;
  onChange?: (event: EventInfo, editor: any) => void;
  onReady?: (editor: EventInfo) => void;
  onBlur?: (event: EventInfo, editor: any) => void;
  onFocus?: (event: EventInfo, editor: any) => void;
  className?: string;
};

const MAXIMUM_MB = 15;

const getTypeOfFile = (name: string) => {
  const nameArr = name.split(".");
  if (!nameArr?.length) return "";
  return nameArr[nameArr.length - 1];
};

function uploadAdapter(loader: any, allowedTypes: string[], maxSizeMB: number) {
  return {
    upload: () => {
      return new Promise((resolve, reject) => {
        const body = new FormData();
        loader.file.then(async (file: any) => {
          // Check file size
          const fileSizeMB = file.size / (1024 * 1024);
          // Check file size
          if (fileSizeMB > maxSizeMB) {
            reject(new Error(`Image size must not exceed ${maxSizeMB}MB`));
            return;
          }

          // Check file type
          const fileType = getTypeOfFile(file.name);
          if (!allowedTypes.includes(fileType)) {
            reject(new Error("Image type must be png/jpg"));
            return;
          }

          body.append("upload", file);
          const [data, error] = await appServices.uploadFile(body);
          if (data) {
            resolve({
              default: data,
            });
          } else if (error) {
            reject(error);
          }
        });
      });
    },
  };
}

function uploadPlugin(editor: any) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) => {
    const allowedTypes = ["png", "jpg"];
    const maxSizeMB = MAXIMUM_MB;
    return uploadAdapter(loader, allowedTypes, maxSizeMB);
  };
}

const config = {
  extraPlugins: [uploadPlugin],
  toolbar: {
    items: [
      "undo",
      "redo",
      "|",
      "heading",
      "|",
      "fontfamily",
      "fontsize",
      "fontColor",
      "uploadImage",
      "|",
      "bold",
      "italic",
      "underline",
      "alignment",
      "fontBackgroundColor",
      "strikethrough",
      "|",
      "link",
      "blockQuote",
      "|",
      "bulletedList",
      "numberedList",
      "indent",
    ],
  },
  fontFamily: {
    options: [
      "Tenon",
      "Arial, Helvetica, sans-serif",
      "Courier New, Courier, monospace",
      "Georgia, serif",
      "Tahoma, Geneva, sans-serif",
      "Times New Roman, Times, seri",
    ],
  },
  ui: {
    poweredBy: {
      position: "border",
      side: "right",
      label: "",
      verticalOffset: 0,
      horizontalOffset: 0,
    },
  },
};

export default function HPEditor({
  data,
  disabled,
  className,
  onChange,
  onBlur,
  onFocus,
}: Props) {
  return (
    <div className={classNames(styles.hpEditor, className)}>
      <CKEditor
        editor={DecoupledEditor as any}
        config={config as any}
        data={data}
        disabled={disabled}
        onReady={(editor) => {
          editor.ui
            .getEditableElement()
            ?.parentElement.insertBefore(
              editor.ui.view.toolbar.element,
              editor.ui.getEditableElement()
            );
        }}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={(e) => {
          onFocus;
        }}
      />
    </div>
  );
}
