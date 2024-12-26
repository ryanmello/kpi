import React from "react";

const KPI = () => {
  return (
    <div className="container mx-auto mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">KPIs</h1>
      </div>
    </div>
  );
};

export default KPI;

// model KPI {
//     id        String   @id @default(auto()) @map("_id") @db.ObjectId
//     userId    String   @db.ObjectId
//     user      User     @relation(fields: [userId], references: [id])
//     month     DateTime
//     projectId String   @db.ObjectId
//     project   Project  @relation(fields: [projectId], references: [id])
//   }
// select a user
// enter a month
// select a project
// update 
