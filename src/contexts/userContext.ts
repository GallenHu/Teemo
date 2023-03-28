import { createContext } from 'react';
import { User } from '@/types/user.d';

interface ContextType {
  user: User | null;
  setUser: (data: User | null) => void;
}

export const UserContext = createContext<ContextType>({ user: null, setUser: () => 0 });

export default UserContext;
