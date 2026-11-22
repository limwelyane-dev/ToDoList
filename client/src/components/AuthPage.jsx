
import Background from "/src/assets/LoginBackground.png";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#EAF4FF] lg:grid lg:grid-cols-2 overflow-hidden">

            <section className="relative hidden min-h-screen overflow-hidden lg:block">
                <img
                    src={Background}
                    alt="Authentication background"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-br from-[#102B4E]/90 via-[#173F65]/70 to-[#36B8D8]/40" />
                <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#36B8D8]/20 blur-3xl" />

                <div className="relative z-10 flex min-h-screen flex-col justify-between p-14">
                    <div className="absolute w-30 h-30 bg-cyan-700 left-5 top-5 z-10 border border-cyan-900 rounded-full"/>
                    <div className="absolute w-20 h-20 bg-cyan-800 left-3 top-25 z-5 rounded-full"/>

                    <div className="max-w-lg mt-10 z-20">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white">
                            Build your future.
                            <span className="block text-[#75DFF0]">
                                Start today.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-md text-sm leading-relaxed italic text-blue-100/80">
                            "The best way to predict your future is to create it."<br />
                            <span className="text-[10px]">-Abraham Lincoln</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mb-8">
                        <span className="text-3xl font-extrabold tracking-tight text-white">
                            ToDo<span className="text-[#54D5EB]">List.</span>
                        </span>
                        <p className="text-sm text-blue-100/60">
                            © 2026 ToDoList. All rights reserved.
                        </p>
                    </div>

                </div>
            </section>

            <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-12 sm:px-10 lg:px-14 overflow-hidden">
                
                <div className="relative mb-10 lg:hidden bg-amber-400">
                    <div className="absolute h-16 w-16 -right-3 -bottom-5 z-0 rounded-full bg-[#54D5EB]" />

                    <span className="absolute text-2xl -right-15 -bottom-2 z-10 font-extrabold tracking-tight text-[#142D4E]">
                        To<span className="text-4xl">Do</span><span className="text-[#36B8D8]">List.</span>
                    </span>
                </div>

                <div className="w-20 border-6 border-b-cyan-400 rounded-full"/>
                <div className="absolute w-50 h-50 border-6 z-0 -left-20 -top-20 border-r-cyan-400 rounded-full"/>

                <div className="absolute w-80 h-80 border-8 z-0 -right-8 border-b-cyan-400 rounded-full"/>
                <div className="absolute w-50 h-50 border-4 z-0 right-8 bottom-20 border-r-cyan-400 rounded-full"/>

                <div className="w-full max-w-md z-10">
                    {children}

                </div>
            </section>

        </div>
    );
}
