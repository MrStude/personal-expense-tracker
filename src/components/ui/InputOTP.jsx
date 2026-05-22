import React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Dot } from "lucide-react";
import { cn } from "@/lib/utils";

const InputOTP = React.forwardRef((props, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn("flex gap-2", props.containerClassName)}
    className={cn(props.className)}
    {...props}
  />
));

const InputOTPSlot = ({ index }) => {
  const { slots } = React.useContext(OTPInputContext);
  const { char } = slots[index];
  return (
    <div className="h-10 w-10 flex items-center justify-center border rounded">
      {char}
    </div>
  );
};

const InputOTPSeparator = () => <Dot />;

export { InputOTP, InputOTPSlot, InputOTPSeparator };
