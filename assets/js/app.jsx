import React from "react";
import ReactDom from "react-dom";
import { generateColor, If } from './functions.jsx'
import { Header } from "./modules.jsx";
import About from "./about.jsx";
import Text from "./text.jsx";
import Quiz from "./quiz.jsx";
import PreTest from "./pre-test.jsx";
import PostTest from "./post-test.jsx";
import MiniGame from "./mini-game.jsx";
require('../css/index.scss');

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            page: 'title',
            textPage: null,
            pages: [
                {label: '16進数', type: 'text', value: 'hex', unlocked: true},
                {label: 'RGB', type: 'text', value: 'rgb', unlocked: false},
                {label: 'カラーコード', type: 'text', value: 'color', unlocked: false},
                {label: '最終テスト', type: 'post-test', value: '', unlocked: false}
            ],
            color: generateColor(),
            hover: false,
            preTestScore: 0,
        };
        this.jumpto = this.jumpto.bind(this);
        this.unlockNextPage = this.unlockNextPage.bind(this);
        this.toggleHover = this.toggleHover.bind(this);
        this.setPreTestScore = this.setPreTestScore.bind(this);
        this.jumpToSurvey = this.jumpToSurvey.bind(this);
    }

    newColor() {
        this.setState({color: generateColor()});
    }

    jumpto(nextPage, text){
        this.setState({
            page: nextPage,
            textPage: text
        });
    }

    unlockNextPage(current, unlockItems){
        let pages = this.state.pages;
        if (current == 'pre-test') {
            unlockItems.forEach((item) => {
                pages[pages.findIndex(p => p.value == item)].unlocked = true;
            });

        } else {
            pages[pages.findIndex(p => p.value == current) + 1].unlocked = true;
        }
        this.setState({pages});
    }

    toggleHover(){
        this.setState({hover: !this.state.hover});
    }

    setPreTestScore(score){
        this.setState({preTestScore: score});
    }

    jumpToSurvey(score){
        const url = `https://docs.google.com/forms/d/e/1FAIpQLScy8Z3NvWRnDkU-mljiadEaE02RK3P-W9G0fLnbr4yPaSu4vA/viewform?usp=pp_url&entry.1899721567=${this.state.preTestScore}&entry.660817417=${score}&entry.1671023033`
        window.open(url, '_blank');
    }

    render() {
        const color = this.state.color;
        const textColor = (color.r * 0.299 + color.g * 0.587 + color.b * 0.114) > 186 ? '#000000' : '#FFFFFF';
        const invertColor = textColor == '#000000' ? '#FFFFFF' : '#000000';
        const normalStyle = {color: `#${color.hex}`, backgroundColor: textColor, borderColor: textColor};
        const hoverStyle = {color: textColor, backgroundColor: 'transparent', borderColor: textColor};
        const buttonStyle = this.state.hover ? hoverStyle : normalStyle;
        return (
            <div>
                <Header handleJump={this.jumpto}/>
                {/* ===== TITLE PAGE ===== */}
                <If condition={this.state.page == 'title'}>
                    <div className='fullScreenWapper'
                        style={{backgroundColor: `#${color.hex}`}}
                         onClick={() => this.newColor()}>
                        <div className='mainWrapper center'>
                            <h1 className='title' style={{color: textColor}}>COLOR</h1>
                            <p className='rgbValues' style={{color: textColor}} >#{color.hex} rgb(
                                    <span className='red'>{color.r}</span>,
                                    <span className='green'>{color.g}</span>,
                                    <span className='blue'>{color.b}</span>)
                            </p>
                            <button
                                className='titleBtn mainBtn large'
                                style={buttonStyle}
                                onMouseEnter={this.toggleHover}
                                onMouseLeave={this.toggleHover}
                                onClick={() => {this.jumpto('pre-test')}}>start pre-test</button>
                        </div>
                    </div>
                </If>
                {/* ===== PRETEST PAGE ===== */}
                <If condition={this.state.page == 'pre-test'}>
                    <PreTest
                        handleUnlock={this.unlockNextPage}
                        handleJump={this.jumpto}
                        setPreTestScore={this.setPreTestScore}/>
                </If>
                {/* ===== INDEX PAGE ===== */}
                <If condition={this.state.page == 'index'}>
                    <div className='fullWidthWrapper center'>
                        <h1>index</h1>
                        <div className='indexList'>
                            {this.state.pages.map((page, idx)=>{
                                return(
                                    <div key={`page-${page.value}`}
                                        className={`indexItem ${page.unlocked ? 'unlocked' : 'locked'}`}
                                        onClick={()=> (page.unlocked) ? this.jumpto(page.type, page.value) : {}}>
                                        <div className='overlay'/>
                                        <span className='labelText'>{page.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            className='mainBtn center minigame'
                            onClick={() => this.jumpto('mini-game')}>
                            mini-game
                        </button>
                    </div>
                </If>
                {/* ===== TEXT PAGE ===== */}
                <If condition={this.state.page == 'text'}>
                    <Text textPage={this.state.textPage} handleJump={this.jumpto}/>
                </If>
                {/* ===== QUIZ PAGE ===== */}
                <If condition={this.state.page == 'quiz'}>
                    <Quiz
                        textPage={this.state.textPage}
                        handleJump={this.jumpto}
                        handleUnlock={this.unlockNextPage}/>
                </If>
                {/* ===== POST-TEST PAGE ===== */}
                <If condition={this.state.page == 'post-test'}>
                    <PostTest jumpToSurvey={this.jumpToSurvey}/>
                </If>
                {/* ===== MINI-GAME PAGE ===== */}
                <If condition={this.state.page == 'mini-game'}>
                    <MiniGame handleJump={this.jumpto}/>
                </If>
                {/* ===== ABOUT PAGE ===== */}
                <If condition={this.state.page == 'about'}>
                    <About />
                </If>
            </div>
        );
    }
}
ReactDom.render(<App/>, document.getElementById("app"));
