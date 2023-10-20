import { IPost } from "@/types/db";
import CommentModal from "../comment/comment-modal";
import Like from "./like";
import ShareButton from "./share";

interface ControlsProps {
    data: IPost;
    single?: boolean;
    queryKey?: string[];
}

export default function Controls({
    data,
    single = false,
    queryKey,
}: ControlsProps) {
    const likedByUser = data.likes.length > 0;

    return (
        <div
            className="relative h-9"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="absolute left-0 top-0 z-10 flex items-center space-x-3.5 py-2">
                <Like
                    postId={data.id}
                    likedByUser={likedByUser}
                    single={single}
                    queryKey={queryKey}
                />

                <CommentModal data={data} single={single} queryKey={queryKey} />
                <ShareButton name={data.author.name!} post={data.id} />
            </div>
        </div>
    );
}
