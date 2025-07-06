const TodoListSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-orange-500 flex items-start justify-center py-8">
      <div className="w-full bg-white border-2 border-black rounded-xl p-4 sm:p-10 pb-16 max-w-lg mx-4">
        {/* Header Skeleton */}
        <div className="flex justify-center items-center mb-5">
          <div className="h-8 w-8 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-8 w-32 bg-gray-300 rounded"></div>
        </div>

        {/* Input and Button Skeleton */}
        <div className="flex items-center bg-gray-200 rounded-full px-5 mb-6 h-16">
          <div className="flex-1 h-6 bg-gray-300 rounded mx-2"></div>
          <div className="h-12 w-24 bg-gray-400 rounded-full"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-center mb-5 gap-4 md:gap-8">
          <div className="h-10 w-36 bg-gray-300 rounded-2xl"></div>
          <div className="h-10 w-40 bg-gray-300 rounded-2xl"></div>
        </div>

        {/* Task List Skeleton */}
        <div className="max-h-[30vh] overflow-y-auto">
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <li key={item} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="h-5 w-5 border-2 border-gray-300 rounded mr-3"></div>
                  <div className="h-5 w-48 bg-gray-300 rounded"></div>
                </div>
                <div className="flex">
                  <div className="h-6 w-6 bg-gray-300 rounded mr-3"></div>
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Filter and Stats Skeleton */}
        <div className="mt-6 flex flex-wrap items-center justify-between">
          <div className="h-10 w-24 bg-gray-300 rounded-2xl mb-4 sm:mb-0"></div>
          <div className="h-10 w-36 bg-gray-300 rounded-2xl mb-2 sm:mb-0"></div>
          <div className="h-10 w-32 bg-gray-300 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TodoListSkeleton;