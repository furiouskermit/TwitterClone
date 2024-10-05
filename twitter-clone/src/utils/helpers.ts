import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// check text max length
export function checkMaxLength(value: string, maxLength: number, handler: any) {
    if(value.length > maxLength) {
        handler();    
    };
};

export function convertNumber (number: number) {
    if(number < 10) {
        return `0${number}`;
    } else {
        return number;
    }
};

export function convertDateYYYYMMDD(value: number | string) {
    const date = new Date(Number(value));
    const convertDate = `${date.getFullYear()}-${convertNumber(date.getMonth()+1)}-${convertNumber(date.getDate())}`
    return convertDate;
};

export const deleteDocument = async(collection: string) => {}

// update documents in "users" collection
export const updateUser = async (user: any, collection: string) => {
    const docRef = doc(db, collection, user.uid);
    const userDoc = await getDoc(docRef);
    const snapshot = userDoc.data();
    if(!snapshot) {
        await setDoc(docRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        });
    } else {
        if(snapshot.displayName != user.displayName || snapshot.photoURL != user.photoURL) {
            await updateDoc(docRef, {
                ...(snapshot.displayName != user.displayName && {
                    displayName: user.displayName
                }),
                ...(snapshot.photoURL != user.photoURL && {
                    photoURL: user.photoURL
                })
            });
        };
    };
};