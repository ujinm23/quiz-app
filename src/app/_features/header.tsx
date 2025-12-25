import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Header() {
  return (
    <div className="flex h-14 w-screen items-center px-12 border-b border-[#E4E4E7] justify-between text-[24px] font-semibold ">
      <p>Quiz app</p>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
}
