import { useContext } from 'react';
import type { AuthContextType as JwtAuthContextType } from '../contexts/jwt-context';
import { AuthContext } from '../contexts/jwt-context';

export const useAuth = <T = JwtAuthContextType>() =>
  useContext(AuthContext) as T;