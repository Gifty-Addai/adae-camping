import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "../../lib/utils";

type OtpInputProps = {
  length: number;
  otpvalue: number;
  onOtpChange: (otp: number) => void;
};

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50 justify-center w-full",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-1", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-12 w-12 items-center justify-center border border-[#4d4d4d] bg-[#353535] text-lg font-semibold rounded-md text-gray-200 transition-all focus:outline-none",
        isActive && "z-10 ring-2 ring-[#8b7355] border-[#8b7355]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-px animate-caret-blink bg-gray-200 duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" className="text-gray-400 px-1" {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-70"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

const OtpInput = ({ length, otpvalue, onOtpChange }: OtpInputProps): JSX.Element => {
  const [val, setVal] = React.useState(otpvalue === 0 ? "" : otpvalue.toString());

  React.useEffect(() => {
    if (otpvalue === 0) {
      setVal("");
    } else {
      setVal(otpvalue.toString());
    }
  }, [otpvalue]);

  const handleChange = (newValue: string) => {
    setVal(newValue);
    const numericValue = isNaN(parseInt(newValue)) ? 0 : parseInt(newValue);
    onOtpChange(numericValue);
  };

  const totalLength = length || 6;
  const showSeparator = totalLength === 6;

  return (
    <div className="flex justify-center py-2 w-full">
      <InputOTP
        maxLength={totalLength}
        value={val}
        onChange={handleChange}
      >
        {showSeparator ? (
          <React.Fragment>
            <InputOTPGroup>
              {Array.from({ length: 3 }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              {Array.from({ length: 3 }).map((_, index) => (
                <InputOTPSlot key={index + 3} index={index + 3} />
              ))}
            </InputOTPGroup>
          </React.Fragment>
        ) : (
          <InputOTPGroup>
            {Array.from({ length: totalLength }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        )}
      </InputOTP>
    </div>
  );
};

export default OtpInput;