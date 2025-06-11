import { Geist, Geist_Mono } from "next/font/google";
import ChatWindow from "../components/ChatWindow";
import FileUploader from "../components/FileUploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen mt-[10px] px-4 pb-10 gap-6 lg:mt-1 lg:px-10 font-[family-name:var(--font-geist-sans)]`}
    >

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full mx-auto">
        <h1 className="text-5xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-black to-sky-400 text-center drop-shadow-md self-center">
          PDF CHATBOT
        </h1>

        {/* Responsive container */}
        <div className="flex flex-col sm:flex-row gap-6 w-full">
          {/* FileUploader Section */}
          <div className="w-full sm:w-1/2 lg:w-[35%] backdrop-blur-md bg-white/60 border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-bold text-gray-800 tracking-tight text-center mb-4">
              <span className="pb-4 inline-block"> Upload Your File</span>
              <div className="h-px bg-gray-300 mt-4 w-full mb-10"></div>
            </h2>
            <FileUploader />
          </div>

          {/* ChatWindow Section */}
          <div className="w-full sm:w-1/2 lg:w-[65%] bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-300 rounded-2xl p-6 shadow-lg transition-transform hover:scale-[1.01]">
            <h2 className="text-lg font-semibold mb-4 text-blue-700">Chat with your PDF</h2>
            <ChatWindow />
          </div>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          {/* Add buttons here */}
        </div>
      </main>
      <footer className="row-start-3 flex flex-col sm:flex-row items-center justify-center w-full text-gray-600 text-sm px-4 lg:px-10 py-6 border-t border-gray-300 mt-10">
        <p className="text-center mb-2 sm:mb-0 font-medium">
          © {new Date().getFullYear()} PDF Chatbot. All rights reserved.
        </p>
      </footer>


    </div>
  );
}
