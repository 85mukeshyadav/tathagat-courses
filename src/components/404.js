//import liraries
import React, { Component } from 'react';

// create a component
const Page404 = () => {
    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                    <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        404
                    </h1>

                </div>

            </div>
        </div>
    );
};



//make this component available to the app
export default Page404;
