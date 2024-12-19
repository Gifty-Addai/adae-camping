import React from "react";
import { ConfirmMembershipResponse } from "@/core/interfaces";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface BookConfirmModalProps {
  loading: boolean;
  confirmData: ConfirmMembershipResponse | null;
  onClose: () => void;
  onApplyMembershipDiscount: () => void;
  onContinueWithoutDiscount: () => void;
}

const BookConfirmModal: React.FC<BookConfirmModalProps> = ({
  loading,
  confirmData,
  onClose,
  onApplyMembershipDiscount,
  onContinueWithoutDiscount,
}) => {
  // Decide message and content based on confirmData
  let title = "Checking Your Membership Status...";
  let message = "We’re looking up your membership details. Grab a coffee while we do this! ☕";
  let actionButton = null;

  if (!loading && confirmData) {
    if (confirmData.success) {
      title = "High-Five, Active Fie Member! 🙌";
      message =
        "Your membership is alive and thriving! Enjoy your extra-special discount and treat yourself to something nice.";
      actionButton = (
        <Button onClick={onApplyMembershipDiscount}>
          Apply My Sweet Discount!
        </Button>
      );
    } else if (confirmData.membershipExpired) {
      title = "Oops, Your Membership Took a Nap 😴";
      message =
        "Your membership dozed off and expired! But no worries, you can still continue without that fancy discount. Maybe consider renewing later?";
      actionButton = (
        <Button onClick={onContinueWithoutDiscount} variant="secondary">
          Continue Without Discount
        </Button>
      );
    } else {
      title = "Oh, You’re Not Fie Member Yet? 🤔";
      message =
        "No membership? No problem! You can still book us. Book us and stand chance to join our Fie(House) family next time.";
      actionButton = (
        <Button onClick={onContinueWithoutDiscount} variant="secondary">
          Continue Without Discount
        </Button>
      );
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-sm w-full mx-auto p-4 flex flex-col items-center text-center space-y-4">
        <DialogHeader className="relative w-full text-center flex flex-col items-center">
          {!loading && confirmData?.success && (
            <span role="img" aria-label="Confetti" className="text-2xl">
              🎉
            </span>
          )}
         
          {/* <DialogClose className="absolute top-4 right-4">
            <X className="h-6 w-6 md:h-8 md:w-8" />
          </DialogClose> */}
        </DialogHeader>
        <DialogTitle className="text-base text-card-foreground md:text-lg font-semibold">
            {title}
          </DialogTitle>
        <div
          className={clsx(
            "text-sm md:text-base text-muted-foreground transition-all duration-300 ease-in-out flex flex-col items-center",
            loading ? "space-y-2" : ""
          )}
        >
          {loading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="animate-spin h-5  w-5 md:h-6 md:w-6" />
              <span>Loading your membership details... Hang tight!</span>
            </div>
          ) : (
            <p className="text-muted-foreground">{message}</p>
          )}
        </div>

        {!loading && confirmData && (
          <div className="flex justify-center space-x-2 pt-4 w-full">
            {actionButton}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookConfirmModal;
