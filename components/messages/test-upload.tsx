import { UploadDropzone } from "@/lib/uploadthing";

export default function TestUpload() {
    return (
        <>
            <UploadDropzone
                endpoint={"messageFile"}
                onUploadError={(error: Error) => {
                    console.log(error);
                }}
            />
        </>
    );
}
