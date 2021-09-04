import React from 'react';
import SignedInContextProvider from "./SignedInContextProvider";
import UserDataContextProvider from './UserDataContextProvider';
import SearchKeywordContextProvider from './SearchkeywordContextProvider';

const AppContextProviders = props => {
    return (
        <>
            <SignedInContextProvider>
                <UserDataContextProvider>
                    {props.children}
                </UserDataContextProvider>
            </SignedInContextProvider>
        </>
    )
}

export default AppContextProviders;