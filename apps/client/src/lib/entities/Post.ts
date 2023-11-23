export interface PostEntity {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    profilePic: string;
    following: boolean;
  };
  reacted: number;
  reactions: number;
  comments: number;
  commented: boolean;
  bookmarked: boolean;
  bookmarks: number;
  popularity: number;
}
