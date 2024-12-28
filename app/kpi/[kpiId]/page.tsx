const KPI = async ({ params }: { params: { kpiId: string } }) => {
  const { kpiId } = await params;
  
  return (
    <div className="container mx-auto mt-4">
      <p>{kpiId}</p>
    </div>
  );
};

export default KPI;
