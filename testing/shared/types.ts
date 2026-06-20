export type BaseEntity = {
  id: string;
  createdAt: number;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Credentials = {
  email: string;
  password: string;
};

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId: string | undefined;
  teamName: string | undefined;
  bio: string;
};

export type UserSeedData = {
  role: UserRoles;
} & UserData;

export type User = Omit<Entity<UserData>, 'teamName' | 'password'>;

export type TeamData = {
  name: string;
  description: string;
};

export type Team = Entity<TeamData>;

export type TeamMemberProperties = {
  userId: string;
  teamId: string;
};

export type DiscussionData = {
  title: string;
  body: string;
  public: boolean;
};

export type DiscussionSeedData = {
  authorId: string;
  teamId: string;
} & DiscussionData;

export type Discussion = {
  author: User;
  teamId: string;
} & Entity<DiscussionData>;

export type CommentData = {
  body: string;
};

export type CommentSeedData = {
  authorId: string;
  discussionId: string;
} & CommentData;

export type Comment = CommentSeedData & Entity<CommentSeedData>;
