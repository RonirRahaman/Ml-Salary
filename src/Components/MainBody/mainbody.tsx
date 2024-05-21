import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import csvJson from '../../Assets/salary.json';
import { ThemeProvider, createTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Line } from '@ant-design/charts';

interface CsvJson {
    work_year: string;
    experience_level: string;
    employment_type: string;
    job_title: string;
    salary: string;
    salary_currency: string;
    salary_in_usd: string;
    employee_residence: string;
    remote_ratio: string;
    company_location: string;
    company_size: string;
}

interface SalaryData {
    year: number;
    totalJobs: number;
    avgSalary: number;
}

const Mainbody: React.FC = () => {
    const columns = [
        { name: 'year', label: 'Year' },
        { name: 'totalJobs', label: 'Total Jobs' },
        { name: 'avgSalary', label: 'Avg. USD' }
    ];

    const [data, setData] = useState<SalaryData[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [isHidden, setIsHidden] = useState(false); 

    useEffect(() => {
        const processedData = processCsvData();
        setData(processedData);
    }, []);

    function processCsvData(): SalaryData[] {
        const yearData: { [key: string]: { totalJobs: number, totalSalary: number } } = {};

        (csvJson as CsvJson[]).forEach((element) => {
            const year = element.work_year;
            const salary = parseFloat(element.salary_in_usd);

            if (!yearData[year]) {
                yearData[year] = { totalJobs: 0, totalSalary: 0 };
            }

            yearData[year].totalJobs += 1;
            yearData[year].totalSalary += salary;
        });

        const processedData: SalaryData[] = Object.entries(yearData).map(([year, data]) => ({
            year: parseInt(year),
            totalJobs: data.totalJobs,
            avgSalary: parseFloat((data.totalSalary / data.totalJobs).toFixed(2)),
        }));

        return processedData;
    }

    const options = {
        selectableRows: 'none' as const,
        elevation: 0,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20, 30],
        onRowClick: (rowData: any) => {
            const selectedYear = rowData[0];
            setIsHidden(true);
            setSelectedYear(selectedYear);
        },
    };
    
    const displaySelectedYearDetailsTable = () => {
        if (!selectedYear) {
            return null;
        }

        const detailedColumns = [
            { name: 'job_title', label: 'Job Title' },
            { name: 'totalJobs', label: 'Total Jobs' },
        ];

        const selectedYearDetails = (csvJson as CsvJson[]).filter(
            (item) => parseInt(item.work_year) === selectedYear
        );

        const aggregatedJobs: { [key: string]: number } = {};
        selectedYearDetails.forEach((item) => 
        {
            const jobTitle = item.job_title;
            if (aggregatedJobs[jobTitle]) 
            {
                aggregatedJobs[jobTitle]++;
            } else {
                aggregatedJobs[jobTitle] = 1;
            }
        });

        const aggregatedJobsData = Object.entries(aggregatedJobs).map(([jobTitle, totalJobs]) => ({
            job_title: jobTitle,
            totalJobs: totalJobs,
        }));

        return (
            <ThemeProvider theme={getMuiThems()}>
                <MUIDataTable
                    title={`Total Jobs for Year ${selectedYear}`}
                    data={aggregatedJobsData}
                    columns={detailedColumns}
                    options={{
                        selectableRows: 'none' as const,
                        elevation: 0,
                        rowsPerPage: 5,
                        rowsPerPageOptions: [5, 10, 20, 30],
                    }}
                />
            </ThemeProvider>
        );
    };

    const getMuiThems = () =>
        createTheme({
            typography: {
                fontFamily: 'Poppins'
            },
            palette: {
                background: {
                    paper: '#1e293b',
                    default: '#0f172a'
                },
                mode: 'dark'
            },
            components: {
                MuiTableCell: {
                    styleOverrides: {
                        head: {
                            padding: '10px 4px',
                        },
                        body: {
                            padding: '10px 15px',
                            color: '#e2e8f0'
                        }
                    }
                }
            }
        });

    // const chartData = data.flatMap(item => [
    //     { year: item.year, value: item.totalJobs, category: 'Total Jobs' },
    //     { year: item.year, value: item.avgSalary, category: 'Average Salary' },
    // ]);

    // const config = {
    //     data: chartData,
    //     xField: 'year',
    //     yField: 'value',
    //     seriesField: 'category',
    //     legend: {
    //         position: 'top',
    //         itemName: {
    //             style: {
    //                 fill: '#fff'
    //             }
    //         },
    //     },
    //     yAxis: {
    //         label: {
    //             style: {
    //                 fill: '#fff'
    //             }
    //         }
    //     },
    //     xAxis: {
    //         label: {
    //             style: {
    //                 fill: '#fff'
    //             }
    //         }
    //     },
    //     color: ['#8884d8', '#82ca9d'],
    //     interactions: [{ type: 'legend-highlight' }, { type: 'legend-filter' }],
    // };

    return (
        <div className="p-5">
            <h1 className="text-center mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Tech Jobs and Salary Details.
            </h1>
            <div className='flex flex-wrap justify-around pt-2'>
                <div className="w-full md:w-6/12 flex justify-center pt-3">
                    <ThemeProvider theme={getMuiThems()}>
                        <MUIDataTable
                            title={"Jobs and Salaries"}
                            data={data}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </div>
                {isHidden && <div className="md:w-6/12 flex justify-center pt-3">
                    {selectedYear && displaySelectedYearDetailsTable()}
                </div>}
                <div className="w-full md:w-6/12 flex justify-center pt-3">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" stroke="#ffffff" />
                            <YAxis stroke="#ffffff" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="totalJobs" name="Total Jobs" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="avgSalary" name="Average Salary" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                    {/* <Line {...config} /> */}
                </div>
            </div>
        </div>
    );
};

export default Mainbody;
