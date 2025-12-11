// {status === "merchant" && step === 4 && (
//   <>
//     <FormLabel>NRC Information</FormLabel>
//     <div className="flex items-center gap-3 w-full">
//       {/* First Select (1x) */}
//       <div className="flex-1">
//         <FormField
//           name="nrcRegion"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormControl>
//                 <Select onValueChange={field.onChange}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="1" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">1</SelectItem>
//                     <SelectItem value="2">2</SelectItem>
//                     <SelectItem value="3">3</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       {/* Second Select (2x) */}
//       <div className="flex-2">
//         <FormField
//           name="nrcTownship"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormControl>
//                 <Select onValueChange={field.onChange}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="Select township" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="A">A</SelectItem>
//                     <SelectItem value="B">B</SelectItem>
//                     <SelectItem value="C">C</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>

//       {/* Third Select (1x) */}
//       <div className="flex-1">
//         <FormField
//           name="nrcType"
//           render={({ field }) => (
//             <FormItem className="w-full">
//               <FormControl>
//                 <Select onValueChange={field.onChange}>
//                   <SelectTrigger className="w-full">
//                     <SelectValue placeholder="N" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="N">N</SelectItem>
//                     <SelectItem value="P">P</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>

//     <FormField
//       name="nrcNumber"
//       render={({ field }) => (
//         <FormItem>
//           {/* <FormLabel>NRC Number</FormLabel> */}
//           <FormControl>
//             <Input placeholder="123456" {...field} />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />

//     <FormField
//       name="images"
//       // control={form.control}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>Images</FormLabel>
//           <FormControl>
//             <ImageUpload
//               images={field.value}
//               onChange={field.onChange}
//             />
//           </FormControl>
//           <FormMessage />
//         </FormItem>
//       )}
//     />
//   </>
// )}
