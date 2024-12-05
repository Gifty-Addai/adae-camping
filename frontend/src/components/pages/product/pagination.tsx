import { Button } from '@/components/ui/button';

const Pagination: React.FC<{ currentPage: number, totalPages: number, goToPage: (page: number) => void }> = ({ currentPage, totalPages, goToPage }) => {
  
  const generatePageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    
    let startPage = Math.max(currentPage - halfRange, 1);
    let endPage = Math.min(currentPage + halfRange, totalPages);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center mt-8 items-center space-x-2">
      {/* Previous button */}
      <Button 
        onClick={() => goToPage(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        {currentPage > 1 && <span onClick={() => goToPage(1)} className="cursor-pointer text-card-foreground text-sm">1</span>}
        {currentPage > 3 && <span className="text-sm text-card-foreground">...</span>}

        {pageNumbers.map(page => (
          <span 
            key={page} 
            onClick={() => goToPage(page)} 
            className={`cursor-pointer text-sm text-card-foreground ${page === currentPage ? 'font-bold' : ''}`}
          >
            {page}
          </span>
        ))}

        {currentPage < totalPages - 2 && <span className="text-sm text-card-foreground">...</span>}
        {currentPage < totalPages && <span onClick={() => goToPage(totalPages)} className="text-card-foreground cursor-pointer text-sm">{totalPages}</span>}
      </div>

      {/* Next button */}
      <Button 
        onClick={() => goToPage(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
