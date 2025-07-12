import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-base text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
export { Input };
