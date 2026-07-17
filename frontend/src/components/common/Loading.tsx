import React from "react";

interface LoadingProps {
    message?: string;
}

const Loading: React.FC<LoadingProps> = ({
    message = "Chargement..."
}) => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                <p className="text-gray-500">{message}</p>
            </div>
        </div>
    );
};

export default Loading;