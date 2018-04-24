       
import React, { Component } from 'react';
import moment from 'moment';

class Calendar extends Component {
    constructor(props){
        super(props);
        this.state = {
            showMonthPopup: false,
            showYearPopup: false,
            dateContext: moment(),
            today: moment()
        }                
    }   

    weekdays = moment.weekdays(); // e.g [monday, tuesday, ....]    
    months = moment.months(); // e.g  [January,..., April, May, ...] e.g array of months.
    
    componentDidMount(){        
        if(this.props.match.params.monthName){
            let monthNo = this.months.indexOf(this.props.match.params.monthName);            
            if(monthNo !== -1){
                let dateContext = Object.assign({}, this.state.dateContext);
                dateContext = moment(dateContext).set("month", monthNo);
                this.setState({
                    dateContext:  dateContext
                });
            }
        }
        
    }

    completeFormat = () =>{
        return this.state.dateContext.format("YYYY-MM-DD");
    }
    
    year = () =>{
        return this.state.dateContext.format("Y");
    }

    month = () =>{
        return this.state.dateContext.format("MMMM");
    }

    daysInMonth = () =>{
        return this.state.dateContext.daysInMonth();
    }

    currentDate = () =>{
        return this.state.dateContext.get("date");
    }

    currentDay = () =>{ // what day is today e.g 23
        return this.state.dateContext.format("D");
    }    

    firstDayOfTheMonth = () =>{
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    }

    //Making additional 7 years from the present year anf 7 years from previous years.
    arrayOfYears = () =>{  
        let futureYears = [];
        let previousYears = [];        
        let dateHolder = parseInt(this.year(), 10);  //changing year string to number
        for(let j = dateHolder - 7; j < dateHolder ; j++){
            previousYears.push(j);  
        }
        for(let i = dateHolder; i < dateHolder + 7; i++){
            futureYears.push(i);  
        }
        return  [...previousYears , ...futureYears];
    }
        
    //SelectList comp Details ------- START********************************
    setMonth = (selectedMonth) =>{
        let monthNo = this.months.indexOf(selectedMonth);
        let dateContext = Object.assign({}, this.state.dateContext);        
        dateContext = moment(dateContext).set("month", monthNo);
        this.props.history.push(dateContext.format("MMMM")); // push the month to the browser.         
        this.setState({
            dateContext: dateContext
        });
    }

    onSelectMonthChange = (e, data) =>{
        this.setMonth(data);
    }

    SelectMonthList = (props) =>{    
        let popup = props.data.map((data) =>{
           return(
                <div key={data}> 
                    <span  onClick={(e) => {this.onSelectMonthChange(e, data)}}>
                        {data}
                    </span>
                </div>
           );
        });
    
        return(
            <div className="month-popup">{popup}</div>
        );
    }
    //SelectList Comp  ------- END********************************
    //#################### MONTHNAV ###########
    onChangeMonth = (e, month) =>{
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () =>{
        //if showMonthPopup is true show SelectList 
        return(
            <span className = "label-month" onClick={(e) =>{ this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup && <this.SelectMonthList data={this.months } /> } 
            </span>
        );
    }
    //#################### MONTHNAV ###########

    //SelectYearList comp Details ------- START********************************
    setYear = (selectdeYear) =>{
        let yearNo = this.arrayOfYears().indexOf(selectdeYear);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", this.arrayOfYears()[yearNo]);        
        this.setState({
            dateContext: dateContext
        });
    }

    onSelectYearChange = (e, data) =>{
        this.setYear(data);
    }

    SelectYearList = (props) =>{    
        let popup = props.data.map((data) =>{
           return(
                <div key={data}> 
                    <span  onClick={(e) => {this.onSelectYearChange(e, data)}}>
                        {data}
                    </span>
                </div>
           );
        });
    
        return(
            <div className="month-popup">{popup}</div>
        );
    }
    //SelectYearList Comp  ------- END********************************
    //#################### YEARNAV ###########
    onChangeYear = () =>{
        this.setState({
            showYearPopup: !this.state.showYearPopup
        });        
    }

    YearNav = () =>{
        return(
            <span className="label-year" onClick={(e) =>{ this.onChangeYear(e, this.year())}} >
                {this.year()}
                {this.state.showYearPopup && <this.SelectYearList data={this.arrayOfYears() } /> } 
            </span>
        )
    }
    //#################### YEARNAV ###########

    //xxxxxxxxxxxxxxxxx Months nav (Next and Prev)
    nextMonth = () =>{
        let dateContext =  Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.props.history.push(dateContext.format("MMMM")); // push the month to the browser.              
        this.setState({
            dateContext: dateContext
        });
       // this.props.onNextMonth && this.props.nextMonth();
    }

    prevMonth = () =>{
        let dateContext =  Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.props.history.push(dateContext.format("MMMM")); // push the month to the browser.
        this.setState({
            dateContext: dateContext
        });
        //this.props.onPrevMonth && this.props.prevMonth();
    }
    //xxxxxxxxxxxxxxxxx Months nav (Next and Prev)  End.

  render() {      
    let theWeekdays = this.weekdays.map((day, index) =>{
        return(
            <td key={index} className="week-day">{day}</td>
        )
    });

    //last day of previous month
    let lastMonthLastDay = moment(this.completeFormat()).subtract(1, 'months').endOf('month').format('DD');
    //console.log(this.month());
    //How many days of the privious month OVERLAPS before the first day of the month.
    let blankStart = [];
    for(let i = this.firstDayOfTheMonth(); i> 0; i--){        
        blankStart.push(<td key={i*80}  className="empty-slot"> {parseInt(lastMonthLastDay, 10) - (i - 1)}</td>);
    }
    
    //find number of days in the month and loop form 1 to the end.
    // Make the className of today different from other days.
    let theDaysInTheMonth = [];
    for(let d = 1; d <= this.daysInMonth(); d++) {
        let className = (d === parseInt(this.currentDay(), 10) && (this.state.today.format("YYYY-MM-DD")) === this.completeFormat()  
            ? "current-day" 
            : "day"
        );
        theDaysInTheMonth.push(
            <td key={d} className={className}>
                <span>{d}</span>
            </td>
        )
    }

    //Looping the overlaped privious days and the days of the month
    // in 7 lines including the remaining last set of days
    let monthlyDisplay = [...blankStart , ...theDaysInTheMonth];
    let rows = [];
    let cells = [];    

    monthlyDisplay.forEach((row, index) =>{
        if(index % 7 !== 0){
            cells.push(row);
        }else{
            let insertRow = cells.slice();
            rows.push(insertRow);
            cells = [];
            cells.push(row);
        }
        if(index === monthlyDisplay.length - 1){  // The last numbers in rhe last week of the month.
            let insertRow = cells.slice();            
            if(insertRow.length < 7){            // Determine how many numbers are in the last week on the month.                
                for(let i = 1; i < 8 - insertRow.length ; i++){  // The numbers in  the last week of the month MUST be 7.      
                    cells.push(<td key={i*80}  className="empty-slot"> {i}</td>);
                }                
            }
            rows.push(cells);
        }
    });
   

    //Displaying all the contents
    let trElems = rows.map((data, index) =>{        
        return(            
            <tr key={index*100}>{data}</tr>
        )        
    })
    
    return (
      <div className="calendar-container center-calendar">
       <table className="calendar">
        <thead>
            <tr className="calendar-header">
                <td colSpan="1"  onClick={(e) =>{this.prevMonth()}}><span className="pre-next">&#10094;</span></td>
                <td colSpan="5">
                    <this.MonthNav/>
                    {" "}
                    <this.YearNav />
                </td>
                <td colSpan="1" onClick={(e) =>{this.nextMonth()}}><span className="pre-next">&#10095;</span></td>
            </tr>
        </thead>
        <tbody>
            <tr>
                {theWeekdays}
            </tr>
            {trElems}
        </tbody>
       </table>
      </div>
    );
  }
}

export default Calendar;