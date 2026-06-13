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

export type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  teamId: string | undefined;
  teamName: string | undefined;
  role: UserRoles;
  bio: string;
};

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

export type Discussion = {
  authorId: string;
  teamId: string;
} & Entity<DiscussionData>;
