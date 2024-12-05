import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogOverlay, DialogTitle } from '@/components/ui/dialog';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSuccess: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, isSuccess }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card p-6 rounded-lg w-full max-w-md shadow-lg">
                <DialogTitle className="text-2xl font-semibold text-card-foreground mb-4">
                    {isSuccess ? 'Hooray, You’re Ready to Go!' : 'Uh-oh, Something Went Wrong!'}
                </DialogTitle>
                <DialogDescription className="text-card-foreground mb-4">
                    {(isSuccess
                        ? 'Your camping gear is on its way! Time to set up your tent and get ready for the adventure of a lifetime. 🏕️'
                        : 'Looks like we hit a small snag! Don’t worry, we’ll have you back on track faster than you can say "Fie ne Fie"!')}
                </DialogDescription>
                <Button
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionModal;
