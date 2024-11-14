export type authResponse = {
  message: string;
  user: {
    id: string;
    verified: boolean;
  };
};
