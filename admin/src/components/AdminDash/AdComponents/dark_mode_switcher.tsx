// import useColorMode from '../../hooks/useColorMode';

// const DarkModeSwitcher = () => {
//   const [colorMode, setColorMode] = useColorMode();

//   return (
//     <li>
//       {/* <label */}
//         className={`relative block h-7.5 w-14 rounded-full cursor-pointer ${
//           colorMode === 'dark' ? 'bg-primary' : 'bg-stroke'
//         }`}
//       >
//         <input
//           type="checkbox"
//           onChange={() => setColorMode(colorMode === 'light' ? 'dark' : 'light')}
//           className="absolute h-full w-full opacity-0"
//         />
//         <span
//           className={`absolute top-1/2 left-[3px] h-6 w-6 rounded-full bg-white shadow transition-transform ${
//             colorMode === 'dark' ? 'translate-x-6' : ''
//           }`}
//         >
//           {colorMode === 'dark' ? (
//             <svg
//               width="16"
//               height="16"
//               fill="currentColor"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               className="text-white"
//             >
//               <path d="M9 2a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1zm0 18a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1-1-1zm-6.293-5.293a1 1 0 0 1 1.414 0L6 17.586l1.879-1.879a1 1 0 1 1 1.414 1.414L7.414 19l2.879 2.879a1 1 0 0 1-1.414 1.414L6 20.414l-2.879 2.879a1 1 0 0 1-1.414-1.414L4.586 19 1.707 16.121a1 1 0 0 1 0-1.414zM21 11h-8a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1zm-1 7h-6v-6h6v6zm-2-3a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
//             </svg>
//           ) : (
//             <svg
//               width="16"
//               height="16"
//               fill="currentColor"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               className="text-black"
//             >
//               <path d="M21 12.92c.58-4.4-3.57-7.93-7.76-6.73a.76.76 0 0 1-.93-.68A8.09 8.09 0 0 0 5.94 12a7.74 7.74 0 0 0 .17 2A8.1 8.1 0 0 0 17 18.73a.78.78 0 0 1 .75 1 7.92 7.92 0 0 0 4.25-7.3zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
//             </svg>
//           )}
//         </span>
//       </label>
//     </li>
//   );
// };

// export default DarkModeSwitcher;
