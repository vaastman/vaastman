"use client";

import { createContext, useContext } from "react";

export type RegisteredStudentsContextType = {
  collegeId: string;
  collegeName: string;
  universityName: string;
  sessions: { id: string; name: string; fees?: string; duration?: string }[];
  domains: { id: string; name: string }[];
};

const RegisteredStudentsContext =
  createContext<RegisteredStudentsContextType | null>(null);

export function RegisteredStudentsProvider({
  value,
  children,
}: {
  value: RegisteredStudentsContextType;
  children: React.ReactNode;
}) {
  return (
    <RegisteredStudentsContext.Provider value={value}>
      {children}
    </RegisteredStudentsContext.Provider>
  );
}

export function useRegisteredStudentsContext() {
  const context = useContext(RegisteredStudentsContext);
  if (!context) {
    throw new Error(
      "useRegisteredStudentsContext must be used within a RegisteredStudentsProvider",
    );
  }
  return context;
}
