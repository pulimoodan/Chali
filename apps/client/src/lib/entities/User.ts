export default interface UserEntity {
  createdAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profilePic: string | null;
  id: string;
  _count: {
    notifications: number;
  };
}
