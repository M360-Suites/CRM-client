import LoginForm from "@/components/auth/forms/login_form";
const LoginPage = () => {
    return (
        <div className="flex flex-col h-full items-center justify-start w-full gap-8 py-20 bg-white">
            <div className="flex flex-col gap-2">
                <h2 className="text-foreground text-4xl/[120%] font-medium">Welcome back</h2>
                <p className="text-foreground text-2xl/[120%] font-normal">sign in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
};

export default LoginPage;