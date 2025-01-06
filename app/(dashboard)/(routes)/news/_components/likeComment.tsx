"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { UserAvatar } from "@/components/user-avatar";
import axios from "axios";
import moment from "moment";
import {
  Check,
  Edit,
  Heart,
  MessageCircle,
  MessageSquare,
  ReplyAll,
  ReplyIcon,
  Star,
  X,
} from "lucide-react";
import { ChatInputPost } from "./chatInput";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/check-language";
import { Profile } from "@prisma/client";
import toast from "react-hot-toast";

const SubReply = ({ val, updateLikeComment, currentProfileId }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(val?.text);

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle save for edited sub-reply
  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(`/api/comment/update/${val?.id}`, {
        commentId: val?.id,
        text: editedText,
      });
      if (response.status === 200) {
        updateLikeComment(true);
        setIsEditing(false);
        toast.success("Comment updated");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to update sub-reply:", error);
    }
  };

  return (
    <div className="my-4 flex justify-between">
      <UserAvatar
        className="min-h-64 min-w-64 max-w-64 mr-3 max-h-64"
        src={val?.profile.imageUrl}
      />
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-500 line-clamp-1 text-base font-bold">
              {val?.profile?.name}
            </div>
            <div className="text-xs">
              {moment(new Date(val?.createdAt))?.fromNow()}
            </div>
          </div>
          {currentProfileId === val?.profileId && (
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4 cursor-pointer" />
                </Button>
              ) : (
                <>
                  <Check
                    className="cursor-pointer text-green-500"
                    onClick={handleEditSubmit}
                  />
                  <X
                    className="cursor-pointer text-red-500"
                    onClick={() => setIsEditing(false)}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {!isEditing ? (
          <p className="break-words text-sm">{val?.text}</p>
        ) : (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="mt-2 w-full rounded-md border p-2 dark:bg-[#131618] dark:text-gray-300"
            rows={3}
          />
        )}

        <div className="my-2 flex items-center">
          <button
            onClick={async () => {
              const response = await axios?.post(`/api/like/create`, {
                commentId: val?.id,
              });
              if (response?.status === 200) updateLikeComment(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium transition-all duration-200 ease-in-out
                 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 dark:hover:bg-rose-900"
            aria-label={!!val?.currentCommentLike ? "Unlike" : "Like"}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ease-in-out ${
                val?.currentCommentLike
                  ? "scale-110 fill-rose-500 text-rose-500"
                  : "text-gray-800 hover:text-rose-500 dark:text-gray-100 dark:hover:text-rose-400"
              }`}
            />
            <span
              className={`${val?.currentCommentLike ? "text-rose-500" : ""}`}
            >
              {val?.likes?.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Reply = ({
  val,
  id,
  updateLikeComment,
  profileImage,
  currentProfileId,
}: {
  val: any;
  id: string;
  updateLikeComment: any;
  profileImage: string;
  currentProfileId: string;
}) => {
  const user = useSelector((state: any) => state?.user);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const currentLanguage = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(val?.text);
  const [isHovered, setIsHovered] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(`/api/comment/update/${val?.id}`, {
        commentId: val?.id,
        text: editedText,
      });
      if (response.status === 200) {
        updateLikeComment(true);
        setIsEditing(false);
        toast.success("Comment updated");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Failed to update comment:", error);
    }
  };

  return (
    <div className="my-4 flex justify-between rounded-lg border p-4 dark:bg-[#131618]">
      <UserAvatar
        className="min-h-64 min-w-64 max-w-64 mr-3 max-h-64"
        src={val?.profile?.imageUrl}
      />
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-500 line-clamp-1 text-base font-bold">
              {val?.profile?.name}
            </div>
            <div className="text-xs">
              {moment(new Date(val?.createdAt))?.fromNow()}
            </div>
          </div>

          {currentProfileId === val?.profile?.id && (
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4 cursor-pointer" />
                </Button>
              ) : (
                <>
                  <Check
                    className="cursor-pointer text-green-500"
                    onClick={handleEditSubmit}
                  />
                  <X
                    className="cursor-pointer text-red-500"
                    onClick={() => setIsEditing(false)}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {!isEditing ? (
          <p className="break-words text-sm">{val?.text}</p>
        ) : (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="mt-2 w-full rounded-md border p-2 dark:bg-[#131618] dark:text-gray-300"
            rows={3}
          />
        )}
        <div className="my-2 flex items-center">
          <button
            onClick={async () => {
              const response = await axios?.post(`/api/like/create`, {
                commentId: val?.id,
              });
              if (response?.status === 200) updateLikeComment(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium transition-all duration-200 ease-in-out
                 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 dark:hover:bg-rose-900"
            aria-label={!!val?.currentCommentLike ? "Unlike" : "Like"}
          >
            <Heart
              size={18}
              className={`transition-all duration-200 ease-in-out ${
                val?.currentCommentLike
                  ? "scale-110 fill-rose-500 text-rose-500"
                  : "text-gray-800 hover:text-rose-500 dark:text-gray-100 dark:hover:text-rose-400"
              }`}
            />
            <span
              className={`${val?.currentCommentLike ? "text-rose-500" : ""}`}
            >
              {val?.likes?.length}
            </span>
          </button>
          <button
            className={`
              mx-1 inline-flex items-center gap-2 rounded-full px-2
              py-1.5 text-xs font-medium transition-colors duration-200 ease-in-out
            ${isHovered ? "bg-[#e2e8f0] dark:bg-[#334155]" : ""}
          `}
            onClick={() => setShowReplyInput(!showReplyInput)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ReplyAll size={18} />
            <span>{val?.subCommentsWithLikes?.length}</span>
            <span className="sr-only">
              {currentLanguage?.news_comments_reply_button_label}
            </span>
          </button>
        </div>

        {val?.subCommentsWithLikes?.map((val: any) => (
          <SubReply
            key={val?.id}
            val={val}
            updateLikeComment={updateLikeComment}
            currentProfileId={currentProfileId}
          />
        ))}
        {showReplyInput && (
          <div className="flex items-center justify-between">
            <UserAvatar
              className="min-h-64 min-w-64 max-w-64 mr-3 max-h-64"
              src={profileImage}
            />
            <div className="w-full">
              <ChatInputPost
                placeHolder={currentLanguage.news_comments_input_placeholder}
                apiUrl="/api/comment/create"
                query={{
                  postId: id,
                  parentCommentId: val?.id,
                }}
                className="w-full"
                updateLikeComment={updateLikeComment}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LikeComment = ({
  id,
  likesCount,
  currentLike,
  commentsWithLikes,
  currentFavorite,
  commentsCount,
  updateLikeComment,
  profileImage,
  currentProfileId,
}: {
  id: string;
  likesCount: number;
  currentLike: boolean;
  currentFavorite: boolean;
  commentsWithLikes: any;
  commentsCount: number;
  updateLikeComment: any;
  profileImage: string;
  currentProfileId: string;
}) => {
  const [commentCount, setCommentCount] = useState(3);
  const [isShowComments, setShowComments] = useState(false);
  const currentLanguage = useLanguage();

  return (
    <div className="mx-3">
      <div className="flex items-center justify-between py-3">
        <div className="flex">
          <button
            onClick={async () => {
              const response = await axios?.post(`/api/like/create`, {
                postId: id,
              });
              if (response?.status === 200) updateLikeComment(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-200 ease-in-out
                 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 dark:hover:bg-rose-900/40"
            aria-label={!!currentLike ? "Unlike" : "Like"}
          >
            <Heart
              size={20}
              className={`transition-all duration-200 ease-in-out ${
                !!currentLike
                  ? "scale-110 fill-rose-500 text-rose-500"
                  : "text-gray-800 hover:text-rose-500 dark:text-gray-100 dark:hover:text-rose-400"
              }`}
            />
            <span className={`${!!currentLike ? "text-rose-500" : ""}`}>
              {likesCount}
            </span>
          </button>
          <button
            onClick={async () => {
              const response = await axios?.post(`/api/favorite/create`, {
                postId: id,
              });
              if (response?.status === 200) updateLikeComment(true);
            }}
            className={`
              mx-1 flex items-center justify-center rounded-full p-2
              transition-all duration-300 ease-in-out
            ${
              currentFavorite
                ? "bg-amber-100 border border-amber-300 dark:bg-amber-900/30 dark:border-amber-600"
                : "hover:bg-amber-50 dark:hover:bg-amber-900/20"
            }
          `}
            aria-label={
              currentFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Star
              size={20}
              className={`
                transition-all duration-300 ease-in-out
            ${
              currentFavorite
                ? "scale-105 fill-amber-400 text-amber-400"
                : "text-gray-800 hover:text-amber-400 dark:text-gray-100 dark:hover:text-amber-300"
            }
          `}
            />
          </button>
        </div>
        <div
          className="flex cursor-pointer items-center rounded-lg bg-slate-100 p-3 text-sm transition duration-300 ease-in-out hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80"
          onClick={() => setShowComments(!isShowComments)}
        >
          <MessageSquare className="mr-1 h-5 w-6" />
          {`${commentsCount} ${currentLanguage.news_comments_button_label}`}
        </div>
      </div>

      {isShowComments && (
        <>
          <div className="flex items-center justify-between">
            <UserAvatar
              src={profileImage}
              className="min-h-64 min-w-64 max-w-64 mr-3 max-h-64"
            />
            <div className="w-full">
              <ChatInputPost
                placeHolder={currentLanguage?.news_comments_input_placeholder}
                apiUrl="/api/comment/create"
                query={{
                  postId: id,
                  parentCommentId: null,
                }}
                className=""
                updateLikeComment={updateLikeComment}
              />
            </div>
          </div>
          <div className="w-full">
            {commentsWithLikes?.map(
              (val: any, index: number) =>
                index < commentCount && (
                  <Reply
                    key={val?.id}
                    val={val}
                    id={id}
                    updateLikeComment={updateLikeComment}
                    profileImage={profileImage}
                    currentProfileId={currentProfileId}
                  />
                )
            )}
          </div>
          {commentCount < commentsWithLikes?.length - 1 && (
            <div className="flex items-center justify-center p-2">
              <Button
                onClick={() => setCommentCount(commentCount + 3)}
                className="cursor-pointer rounded-full p-4 text-center"
                variant="secondary"
                size="lg"
              >
                {currentLanguage.news_comments_showmore_label}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LikeComment;