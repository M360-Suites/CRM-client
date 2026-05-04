import HalfSide from "@/components/auth/halfside";
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-row justify-between min-h-screen font-inter bg-white w-full">
            <HalfSide />
            <div className="w-1/2">
                {children}
            </div>
        </div>
    );
}

export default AuthLayout;