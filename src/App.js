/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import Web3 from "web3";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [feedback, setFeedback] = useState("");
  const [claimingNft, setClaimingNft] = useState(false);
  var [amount, setAmount] = useState(1);

  const url = "https://crypto.com/defi/dashboard-api/price-update";
  var headers = {
  }
  
  const { ethereum } = window;
  var web3 = new Web3(ethereum);

  var gasUcret;
  async function claimNft(){
    await fetch(url, {
      method : "GET",
      mode: 'cors',
      headers: headers
    })
    .then((response) => {
      return response.json();
    })
    .then(newGas => {
      //console.log(newGas.gasRange.fastest);
      gasUcret = newGas.gasRange.fast;
      web3.eth.getGasPrice().then(()=>{
        setClaimingNft(true);
        setFeedback(null);
        //console.log("ucret alt:"+gasUcret);
        blockchain.smartContract.methods.mint(blockchain.account, amount).send({
          from:blockchain.account,
          //gas:(240000*amount),
          maxFeePerGas:(web3.utils.toWei(gasUcret.toString(), 'gwei')/10),//gas
          maxPriorityFeePerGas:1500000000,
          value: data.preSaleActive ? data.preSaleCost*amount : data.cost*amount
        }).once("error", () => {
          setClaimingNft(false);
          setFeedback("Something gone wrong!");
        }).then(() => {
          getData();
          setClaimingNft(false);
          setFeedback("Successfully minted!");
        });
      });
    })
  }

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  useEffect(() => {
    setTimeout(() => {
    }, 4000);
    getData();
  }, [blockchain.account]);


  return (
    <div class="overflow-x-hidden">
        {/* MODAL START */}
        <div class="ud-modal">
            <div class="wrapper">
                <div class="ud-modal-close ud-modal-open" id="ud-modal-close">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>                       
                </div>

                <div class="connect-container">
                    <div class="connect-container-header">
                        <span>Address </span>
                        {blockchain.account != null ? <span style={{float:"right"}}>&emsp;{(blockchain.account).substr(0,7) + "..." + (blockchain.account).substr(37)}</span> : ""}
                    </div>
                </div>

                <div class="table-container">
                    <div class="price-name">
                        <span>Price</span>
                    </div>

                    <div class="price">
                        {data.preSaleActive ? (
                            <><span id="priceCheck">{web3.utils.fromWei(data.preSaleCost.toString(), "ether")}</span><span>&nbsp;ETH</span></>
                        ) : (
                            <><span id="priceCheck">{web3.utils.fromWei(data.cost.toString(), "ether")}</span><span>&nbsp;ETH</span></>
                        )}
                    </div>
                </div>

                <div class="table-container mb-5">
                    <div class="price-name">
                        <span>You'll Pay</span>
                    </div>

                    <div class="price">
                        {data.preSaleActive ? (
                            <><span id="payment">{web3.utils.fromWei(data.preSaleCost.toString(), "ether")}</span><span>&nbsp;ETH</span></>
                        ) : (
                            <><span id="payment">{web3.utils.fromWei(data.cost.toString(), "ether")}</span><span>&nbsp;ETH</span></>
                        )}
                    </div>
                </div>

                <div class="count-container mb-5">
                    <div class="count-wrapper">
                        <a id="counterAmount" href="#" onClick={()=>{
                            amount = document.getElementById("amountInput").value;
                        }}> </a> 
                        <div class="count-minus" id="count-minus">
                            <a class="minus" href="javascript:void(0)" style={{color:"red"}}>-</a>
                        </div>

                        <div class="count">
                            <input id="amountInput" type="number" defaultValue="1" readOnly/>
                        </div>

                        <div class="count-plus" id="count-plus">
                            <a class="plus" href="javascript:void(0)">+</a>
                        </div>
                    </div>
                </div>
                {data.totalSupply >= (data.maxSupply-10) 
                    ? <h3 class="ud-mb-20 text-white">*Last {data.maxSupply-data.totalSupply} NFTs</h3>
                    : "" }
                <div class="count-container mb-5">
                    <h3 id="feedbackText" style={{color:"white"}}>{feedback}</h3>
                </div>
                        
                <div class="submit-button-container">
                    <button class="font-gotham-bold bg-customred text-size font-gotham" onClick={(e)=>{
                        e.preventDefault();
                        claimNft();
                    }} style={{pointerEvents:claimingNft ? "none" : "",opacity:claimingNft ? "0.3" : ""}}>{claimingNft ? "BUSY" : "PAY"}</button>
                </div>
            </div>
        </div>
        {/* MODAL END */}    
        
        {/* MOBILE MENU START */}
        <div id="mobilemenu" class="bg-black fixed top-0 left-0 right-0 bottom-0 z-50 hidden">
            <div class="container mx-auto px-5 h-full flex items-center justify-center">
                {/* Close Menu Start */}
                <div class="close absolute top-5 right-5 bg-white bg-opacity-10 p-2 cursor-pointer rounded-md mobile-menu-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white text-opacity-50" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>                    
                </div>
                {/* Close Menu End */}

                {/* Menu Start */}
                <ul class="menu justify-center items-center text-center" id="topmenu">
                    <li><a class="text-white font-montserrat font-bold uppercase py-2 block" href="#">About</a></li>
                    <li><a class="text-white font-montserrat font-bold uppercase py-2 block" href="#">Vision</a></li>
                    <li><a class="text-white font-montserrat font-bold uppercase py-2 block" href="#">Roadmap</a></li>
                    <li><a class="text-white font-montserrat font-bold uppercase py-2 block" href="#">Faq</a></li>
                    <li><a class="text-white font-montserrat font-bold uppercase py-2 block" href="#">Team</a></li>
                </ul>                
                {/* Menu End */}
            </div>
        </div>
        {/* MOBILE MENU END */}        

        {/* HEADER START */}
        <header id="header" class="py-9 bg-black">
            <div class="container mx-auto px-5 lg:px-0">
                <div class="grid grid-cols-12 items-center">
                    <div class="col-span-2">
                        <img src="assets/img/logo.png" class="w-1/2" alt=""/>
                    </div>
                    <div class="col-span-10 flex items-center justify-end">
                        {/* Menu Start */}
                        <ul class="md:flex hidden">
                            <li><a class="text-white font-gotham font-bold text-lg uppercase py-2 px-2 lg:px-5 hover:text-customred transition-all" href="#">About</a></li>
                            <li><a class="text-white font-gotham font-bold text-lg uppercase py-2 px-2 lg:px-5 hover:text-customred transition-all" href="#">Roadmap</a></li>
                            <li><a class="text-white font-gotham font-bold text-lg uppercase py-2 px-2 lg:px-5 hover:text-customred transition-all" href="#">Faq</a></li>
                            <li><a class="text-white font-gotham font-bold text-lg uppercase py-2 px-2 lg:px-5 hover:text-customred transition-all" href="#">Team</a></li>
                        </ul>
                        {/* Menu End */}

                        {/* Button Stat */}
                        <a class="bg-customred text-white font-gotham font-black text-lg lg:text-2xl uppercase py-3 px-10 inline-block rounded-full text-shadow-sm hover:bg-red-600 transition-all mx-5" href="#"
                            onClick={(e)=>{
                                e.preventDefault();
                                dispatch(connect());
                            }} style={{backgroundColor:blockchain.account != null ? "lime" : "red", color:"white"}}>
                            {blockchain.account!=null ? (blockchain.account.substr(0,5) + "..." + blockchain.account.substr(37)) : (
                            <>{blockchain.errorMsg !== "" ? (blockchain.errorMsg) : ("CONNECT")}</>)}</a>
                        {/* Button End */}

                        {/* Social Start */}
                        <ul class="lg:flex hidden">
                            <li>
                                <a class="p-2 block" href="https://www.instagram.com/nugznftofficial/">
                                    <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.6514 7.78125C10.2628 7.78125 7.45508 10.4371 7.45508 13.7454C7.45508 17.0536 10.2144 19.7095 13.6514 19.7095C17.0884 19.7095 19.8477 17.007 19.8477 13.7454C19.8477 10.4837 17.04 7.78125 13.6514 7.78125ZM13.6514 17.5661C11.473 17.5661 9.68188 15.8421 9.68188 13.7454C9.68188 11.6486 11.473 9.92461 13.6514 9.92461C15.8298 9.92461 17.6209 11.6486 17.6209 13.7454C17.6209 15.8421 15.8298 17.5661 13.6514 17.5661Z" fill="white"/>
                                        <path d="M20.0898 8.99253C20.8651 8.99253 21.4936 8.38756 21.4936 7.64128C21.4936 6.89501 20.8651 6.29004 20.0898 6.29004C19.3144 6.29004 18.6859 6.89501 18.6859 7.64128C18.6859 8.38756 19.3144 8.99253 20.0898 8.99253Z" fill="white"/>
                                        <path d="M23.7204 4.14671C22.4618 2.88865 20.6707 2.23633 18.6375 2.23633H8.66528C4.45371 2.23633 1.646 4.93882 1.646 8.99256V18.5445C1.646 20.548 2.32372 22.2721 3.67917 23.5301C4.9862 24.7416 6.72892 25.3473 8.71368 25.3473H18.5891C20.6707 25.3473 22.4134 24.695 23.672 23.5301C24.979 22.3186 25.6568 20.5946 25.6568 18.5911V8.99256C25.6568 7.03558 24.979 5.35817 23.7204 4.14671ZM23.5268 18.5911C23.5268 20.0355 22.9943 21.2004 22.1229 21.9925C21.2516 22.7846 20.0413 23.2039 18.5891 23.2039H8.71368C7.26142 23.2039 6.0512 22.7846 5.17984 21.9925C4.30848 21.1538 3.8728 19.9889 3.8728 18.5445V8.99256C3.8728 7.59472 4.30848 6.42985 5.17984 5.59115C6.00279 4.79904 7.26142 4.37968 8.71368 4.37968H18.6859C20.1382 4.37968 21.3484 4.79904 22.2197 5.63774C23.0427 6.47645 23.5268 7.64131 23.5268 8.99256V18.5911Z" fill="white"/>
                                    </svg>                                        
                                </a>
                            </li>
                            <li>
                                <a class="p-2 block" href="https://twitter.com/NugzNFTs">
                                    <svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M26.2564 2.93264C25.2955 3.35292 24.2613 3.63641 23.1761 3.76327C24.2841 3.11067 25.1336 2.07695 25.5342 0.843792C24.4979 1.44889 23.3507 1.88796 22.1286 2.12498C21.1507 1.09961 19.7567 0.458496 18.2141 0.458496C15.2526 0.458496 12.8515 2.82092 12.8515 5.73518C12.8515 6.14814 12.8987 6.55067 12.9905 6.93753C8.5332 6.71721 4.58103 4.61688 1.9358 1.42435C1.47415 2.20329 1.20989 3.10963 1.20989 4.07757C1.20989 5.90799 2.15655 7.52331 3.59563 8.46932C2.7169 8.44165 1.88964 8.2041 1.16638 7.80889C1.16585 7.83081 1.16585 7.85326 1.16585 7.87571C1.16585 10.4318 3.01459 12.564 5.46825 13.0495C5.01827 13.1696 4.54441 13.2344 4.05516 13.2344C3.70919 13.2344 3.3733 13.2015 3.04589 13.1393C3.72882 15.2355 5.70916 16.7615 8.05563 16.8038C6.22016 18.2192 3.90818 19.0629 1.39509 19.0629C0.962618 19.0629 0.535456 19.0378 0.115723 18.9887C2.48979 20.4866 5.30853 21.3595 8.33687 21.3595C18.2019 21.3595 23.5958 13.3195 23.5958 6.34653C23.5958 6.11786 23.5911 5.88971 23.581 5.66313C24.6285 4.92073 25.538 3.9909 26.2564 2.93264Z" fill="white"/>
                                    </svg>                                                                          
                                </a>
                            </li>
                            <li>
                                <a class="p-2 block" href="https://discord.gg/nugz">
                                    <svg width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M26.3843 3.93675C26.3764 3.9221 26.3632 3.91063 26.3472 3.90437C24.4931 3.09531 22.5365 2.51838 20.5264 2.18803C20.5081 2.1848 20.4892 2.18713 20.4724 2.19469C20.4557 2.20224 20.4418 2.21464 20.4328 2.23012C20.1664 2.69003 19.9246 3.16244 19.7082 3.64553C17.5414 3.3327 15.3373 3.3327 13.1705 3.64553C12.9527 3.16121 12.707 2.68869 12.4345 2.23012C12.4251 2.21498 12.4112 2.20287 12.3945 2.19536C12.3778 2.18785 12.3591 2.1853 12.3409 2.18803C10.3305 2.51769 8.37382 3.09466 6.51998 3.90442C6.50411 3.91082 6.49072 3.92174 6.48165 3.93569C2.77434 9.20128 1.75876 14.3374 2.25697 19.4099C2.25837 19.4224 2.26239 19.4344 2.26878 19.4453C2.27517 19.4563 2.2838 19.4658 2.29417 19.4735C4.45291 20.9937 6.86748 22.1541 9.43485 22.9052C9.45293 22.9103 9.47224 22.9101 9.49018 22.9045C9.50812 22.8989 9.52382 22.8882 9.53519 22.8739C10.0866 22.1603 10.5752 21.4047 10.996 20.6147C11.0018 20.6039 11.0051 20.592 11.0057 20.5798C11.0063 20.5677 11.0042 20.5556 10.9995 20.5443C10.9948 20.5329 10.9877 20.5227 10.9785 20.5142C10.9694 20.5057 10.9584 20.4992 10.9464 20.495C10.176 20.2146 9.43005 19.8766 8.7157 19.4842C8.70273 19.4769 8.69183 19.4667 8.68397 19.4545C8.67611 19.4423 8.67154 19.4284 8.67065 19.4142C8.66976 19.3999 8.67258 19.3856 8.67887 19.3726C8.68516 19.3596 8.69472 19.3482 8.70671 19.3396C8.8566 19.2328 9.00658 19.1217 9.14971 19.0095C9.16243 18.9995 9.17782 18.9931 9.19414 18.991C9.21047 18.9889 9.22708 18.9912 9.24212 18.9976C13.9221 21.029 18.9889 21.029 23.6135 18.9976C23.6285 18.9908 23.6453 18.9882 23.6619 18.9901C23.6784 18.992 23.6941 18.9984 23.707 19.0084C23.8502 19.1206 24.0001 19.2328 24.1512 19.3396C24.1632 19.3481 24.1728 19.3594 24.1792 19.3724C24.1856 19.3853 24.1886 19.3996 24.1878 19.4139C24.187 19.4282 24.1825 19.4421 24.1748 19.4543C24.167 19.4666 24.1562 19.4768 24.1433 19.4842C23.4305 19.8799 22.684 20.2177 21.9115 20.4939C21.8995 20.4983 21.8886 20.505 21.8795 20.5136C21.8704 20.5222 21.8633 20.5326 21.8587 20.544C21.8541 20.5554 21.8521 20.5676 21.8528 20.5797C21.8535 20.5919 21.8569 20.6038 21.8628 20.6147C22.2907 21.4003 22.7786 22.155 23.3225 22.8726C23.3336 22.8874 23.3492 22.8984 23.3672 22.9042C23.3852 22.91 23.4047 22.9103 23.4229 22.905C25.9948 22.1565 28.4136 20.996 30.5751 19.4735C30.5856 19.4662 30.5944 19.4569 30.6008 19.4461C30.6072 19.4353 30.6111 19.4233 30.6123 19.411C31.2087 13.5466 29.6137 8.4526 26.3843 3.93675ZM11.6949 16.3213C10.2859 16.3213 9.12491 15.0915 9.12491 13.5812C9.12491 12.0709 10.2634 10.841 11.6949 10.841C13.1377 10.841 14.2874 12.0815 14.2649 13.5811C14.2649 15.0915 13.1264 16.3213 11.6949 16.3213ZM21.197 16.3213C19.7881 16.3213 18.6271 15.0915 18.6271 13.5812C18.6271 12.0709 19.7655 10.841 21.197 10.841C22.6399 10.841 23.7896 12.0815 23.767 13.5811C23.767 15.0915 22.6399 16.3213 21.197 16.3213Z" fill="white"/>
                                    </svg>                                                                                                              
                                </a>
                            </li>
                        </ul>
                        {/* Social End */}

                        {/* Menu Button Start */}
                        <button class="bg-white p-4 text-black rounded-md md:hidden mobile-menu-btn"> 
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd" />
                            </svg>                            
                        </button>
                        {/* Menu Button End */}
                    </div>
                </div>
            </div>
        </header>
        {/* HEADER END */}

        {/* HERO START */}
        <div id="hero" class="py-20">
            <div class="container mx-auto px-5 lg:px-0">
                <div class="grid grid-cols-6 lg:grid-cols-12 items-center">
                    <div class="col-span-6 order-2 lg:order-1" data-aos="fade-right">
                        {/* Title Start */}
                        <div class="text-center font-blackway text-white text-[125px] xl:text-[175px] 2xl:text-[225px] leading-[75px] xl:leading-[125px] 2xl:leading-[175px]">Nugz <br/> <span class="text-[75px] xl:text-[125px] 2xl:text-[200px]">NFTs</span></div>
                        {/* Title End */}

                        {/* Buttons Start */}
                        <div class="sm:flex my-14">
                            {blockchain.account != null && blockchain.smartContract !=null && !data.paused && data.totalSupply != data.maxSupply ? (
                                <>
                                    {(data.preSaleActive && data.whitelist) || !data.preSaleActive ? (
                                        <a href="#" onClick={modalOpen} class="mb-5 sm:mb-0 block bg-customred text-white font-gotham font-black 
                                            text-lg xl:text-2xl inline-block 2xl:text-4xl inline-block uppercase py-5 px-5 md:px-10 inline-block 
                                            sm:inline-block rounded-2xl text-shadow-sm hover:bg-red-600 transition-all flex-1 mx-2 text-center">Mint Now!</a>
                                    ) : (
                                        <a href="#" class="mb-5 sm:mb-0 block bg-customred text-white font-gotham font-black 
                                            text-lg xl:text-2xl inline-block 2xl:text-4xl inline-block uppercase py-5 px-5 md:px-10 inline-block 
                                            sm:inline-block rounded-2xl cursor-none text-shadow-sm hover:bg-red-600 transition-all flex-1 mx-2 text-center text-size">Not Whitelisted!</a>
                                    )} 
                                </>
                            ):( <h2 href="#" id="countDown" class="mb-5 sm:mb-0 block bg-customred text-white font-gotham font-black 
                                    text-lg xl:text-2xl inline-block 2xl:text-4xl inline-block uppercase py-5 px-5 md:px-10 inline-block 
                                    sm:inline-block rounded-2xl text-shadow-sm cursor-default flex-1 mx-2 text-center">00:00:00:00</h2>)}
                                    
                            <a href="https://discord.gg/nugz" class="block bg-customred text-white font-gotham font-black text-lg 
                                xl:text-2xl 2xl:text-4xl uppercase py-5 px-5 md:px-5 sm:inline-block rounded-2xl text-shadow-sm 
                                hover:bg-red-600 transition-all mx-2 text-center">Join Discord</a>                            
                        </div>
                        {/* Buttons End */}
                    </div>
                    <div class="col-span-6 order-1 lg:order-2 mb-10 lg:mb-0" data-aos="fade-left">
                        <img src="assets/img/hero-right.png" class="w-1/2 lg:w-auto mx-auto lg:scale-125" alt=""/>
                    </div>
                </div>
            </div>
        </div>
        {/* HERO END */}

        {/* INTRODUCTION START */}
        <div id="introduction" class="py-16">
            <div class="container mx-auto px-5 lg:px-0">
                {/* Title Start */}
                <div class="text-white text-3xl md:text-6xl 2xl:text-[110px] font-melon text-center big-title leading-none mb-14" data-aos="fade-down">Introduction</div>
                {/* Title End */}

                {/* Text Start */}
                <div class="text-white text-content-area text-lg md:text-xl 2xl:text-3xl" data-aos="fade-right">
                   <p><strong class="font-black">Nugz aren’t just any ordinary addition to your “head stash”, it’s much more. </strong> Becoming a part of this family gives you the opportunity to give back to those in need.  The Nugz team plans to use a percentage of the proceeds to donate to the American Cancer Society, helping as many as we possibly can.  Together, we can make a difference. </p>
                    
                   <p><strong class="font-black">Holding Nugz also grants users access to a members-only reward system filled with plenty of benefits and opportunities; both in the real world and in the Metaverse. </strong> This includes giveaways, branded merchandise, figurines (Nugz Companions), an exclusive clubhouse with perks & activities, and the ability to “roll up” (mutate) your Nugz down the road. ️</p>
                    
                    <p><strong class="font-black">The Nugz Team plans to use a percentage of generated revenue to introduce a token reward system as well as a mining facility, enabling daily rewards & benefits for all holders to enjoy.</strong> The revenue from mining will be dumped back into our token monthly, thus increasing the value of rewards.  An extensive marketing campaign will then be launched, exposing the token to outside investors.  Our goal is to ensure that all members’ experiences are enjoyable while providing them with the ability to obtain great returns on their investments. 
On behalf of the Nugz Team, we are all very excited to grow as a community and reach higher levels. 
#Nugz</p>
                    
                    <p>On behalf of the Nugz Team, we are all very excited to grow as a community
                    and reach higher levels 📈 </p>
                    
                    
                </div>
                {/* Text End */}
            </div>
        </div>
        {/* INTRODUCTION END */}

        {/* ROADMAP START */}
        <div id="roadmap" class="py-16">
            <div class="container mx-auto px-5 lg:px-0">
                {/* Title Start */}
                <div class="text-white text-3xl md:text-6xl 2xl:text-[110px] font-melon text-center big-title leading-none mb-14" data-aos="fade-down">Roadmap</div>
                {/* Title End */}
                
                {/* Grid Start */}
                <div class="grid grid-cols-6 lg:grid-cols-12">
                    <div class="col-span-6 lg:pr-5 lg:border-r-8 border-r-img">
                        <div class="mb-14">
                            {/* Title Box Stat */}
                            <div class="relative" data-aos="fade-left">
                                <div class="title-box box-1 inline-block font-poppins text-2xl md:text-4xl font-black text-white py-3 pl-8 pr-20 mb-10">💎 Chapter 1. 💎</div>
                                <img src="assets/img/roadmap-title-round.png" class="hidden lg:block absolute top-0 -right-14 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins md:text-lg text-content-area">
                            <p>•Discord and whitelisting becomes open to the public. Here, our team will award a list of community members to participate in our presale event. Whitelist will guarantee a spot to buy before public sale at a lower price! For more information, please join our discord. </p>
                                
                                <p>•Presale and Public Mint becomes available to the community. All dates will be given in advance via the announcements tab in our discord or on socials.  See the FAQ section more information on limitations per wallet / transaction.</p>
                                
                                <p> • Nugz Reveal. Here, all unique Nugz characters will be revealed, becoming a part of their holder's life and welcoming them to our family. </p>                                                    
                            </div>
                            {/* Content End */}
                        </div>

                        <div class="mb-14 lg:hidden">
                            {/* Title Box Stat */}
                            <div class="relative">
                                <div class="title-box chapter-2 inline-block font-poppins text-2xl md:text-4xl font-black text-white py-3 pr-8 pl-20 mb-10 lg:ml-10">🌳 Chapter 2. 🌳</div>
                                <img src="assets/img/chapter-2-round.png" class="hidden lg:block absolute top-0 -left-24 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins md:text-lg text-content-area">
                                <p>• The Nugz family donates to the American Cancer Society.</p>                                                
                            </div>
                            {/* Content End */}
                        </div>                           

                        <div class="mb-14">
                            {/* Title Box Stat */}
                            <div class="relative" data-aos="fade-left">
                                <div class="title-box chapter-3 inline-block font-poppins text-2xl md:text-4xl font-black text-white py-3 pl-8 pr-20 mb-10">💨 Chapter 3. 💨</div>
                                <img src="assets/img/chapter-3-round.png" class="hidden lg:block absolute top-0 -right-14 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins md:text-lg text-content-area">
                                <p> • "Roll-up" (Mutation) event goes live. Here, the community will be introduced to the Nugz Mutation capabilities which enables holders to turn their Nugz into a “rolled-up” masterpiece. These exclusive mutations will carry 1-of-3 tiered values granting holders the access to higher valued rewards and benefits. (More Information TBA) </p>
                                
                                <p>*P.S. I heard it takes about 3 Nugz to “Roll-Up” these days … </p>
                                
                                <p>• It is suggested that users hold at least 3 Nugz to be eligible for the mutation event. *Note: rarity of Nugz does not determine the rarity of future mutations. (More Information TBA) </p>                                        
                            </div>
                            {/* Content End */}
                        </div>

                        <div class="mb-14 lg:hidden">
                            {/* Title Box Stat */}
                            <div class="relative">
                                <div class="title-box chapter-4 inline-block font-poppins text-2xl md:text-4xl font-black text-white py-3 pr-8 pl-20 mb-10 lg:ml-10">🌳 Chapter 4. 🌳</div>
                                <img src="assets/img/chapter-4-round.png" class="hidden lg:block absolute top-0 -left-24 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins md:text-lg text-content-area">
                                <p>• Metaverse real estate purchase. All members will have the opportunity to vote on where our Nugz property will be located within the Metaverse. </p>
                                
                                <p>• A multifunctional clubhouse will then be created on this plot of land. This clubhouse will include a digital dispensary / lounge, restaurant, and a shop filled with Nugz merchandise.  An outdoor movie theater will be introduced as well, allowing holders to invite friends to movie nights and watch parties. </p>
                                
                                <p>• Multiple play to earn games and activities will also be included within the space for everyone to enjoy.</p>
                                
                                <p>• Our land will be open to the public, however, only Nugz holders have access to the games, activities, and benefits inside of the world. </p>
                                                                                                                   
								<p>• The Nugz Team hosts AMAs for all other suggestions regarding new implementations or improvements.</p>																				   
                            </div>
                            {/* Content End */}
                        </div>                            

                        <div class="mb-14">
                            {/* Title Box Stat */}
                            <div class="relative" data-aos="fade-left">
                                <div class="title-box chapter-5 inline-block font-poppins text-2xl md:text-4xl font-black text-white py-3 pl-8 pr-20 mb-10">🏠 Chapter 5. 🏠</div>
                                <img src="assets/img/chapter-5-round.png" class="hidden lg:block absolute top-0 -right-14 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins md:text-lg text-content-area">
                                <p>• Community “Hotbox” (Clubhouse Celebration). Here, the Nugz community comes together to celebrate the official launch of our new multifunctional clubhouse and all of its perks. </p>

                                <p> • Nugz token is launched. All rewards will be distributed to holders accordingly. Percentages of revenue will be used to fuel the coin upon launch along with funding an extensive marketing campaign to provide awareness to other outside investors. Tokens accumulate on the Nugz website, where holders will have access to claim their tokens at any time. This will be done by connecting a wallet containing Nugz and selecting “Claim” </p>

                                <p>• Tokens can be spent on merchandise from the Nugz shop as well as other perks inside and out of our clubhouse.  You can also exchange them and simply cash out whenever you choose.</p>

                                <p>• Mining facility build.  Here, the Nugz Team develops an extensive plan to begin the mining process as a way to increase the revenue going into the coin. 50% of all mined revenue will be recycled back into the token monthly to create continuous growth and rewards for all holders.   </p>                                 
 
					  </div>
                            {/* Content End */}
                        </div>
                    </div>
                    <div class="col-span-6 pl-5 hidden lg:block">
                        <div class="mb-14 mt-52 pl-10">
                            {/* Title Box Stat */}
                            <div class="relative" data-aos="fade-right">
                                <div class="title-box chapter-2 inline-block font-poppins text-4xl font-black text-white py-3 pr-8 pl-20 mb-10 ml-10">🌳 Chapter 2. 🌳</div>
                                <img src="assets/img/chapter-2-round.png" class="absolute top-0 -left-24 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins text-lg text-content-area">
                                <p>• The Nugz family donates to the American Cancer Society.</p>                                                
                            </div>
                            {/* Content End */}
                        </div>                        
                        <div class="mb-14 mt-96 pl-10">
                            {/* Title Box Stat */}
                            <div class="relative" data-aos="fade-right">
                                <div class="title-box chapter-4 inline-block font-poppins text-4xl font-black text-white py-3 pr-8 pl-20 mb-10 ml-10">🌳 Chapter 2. 🌳</div>
                                <img src="assets/img/chapter-4-round.png" class="absolute top-0 -left-24 h-16 bg-black rounded-full" alt=""/>
                            </div>
                            {/* Title box End */}

                            {/* Content Start */}
                            <div class="text-white font-poppins text-lg text-content-area">
                                <p>• Metaverse real estate purchase. All members will have the opportunity to vote
                                on where our Nugz property will be located within the Metaverse.</p>
                                
                                <p>• A multifunctional clubhouse will then be created on this plot of land. This
                                clubhouse will include a smoke bar / lounge, eatery, and a shop filled with Nugz
                                merchandise. During the development of this clubhouse, the Nugz Team plans to
                                introduce an outdoor movie theater for hosting virtual watch parties and movie
                                nights. All holders will be able to invite friends from other communities as well.</p>
                                
                                <p>• Play to earn games and activities will also be included within the space for
                                everyone to enjoy.</p>
                                
                                <p>• The Nugz Team hosts AMAs for all other suggestions regarding new
                                implementations or improvements.</p>
                                                                                                                   
                            </div>
                            {/* Content End */}
                        </div>                        
                    </div>
                </div>
                {/* Grid end */}

                {/* Info Text Start */}
                <div class="text-white border-t-2 border-dashed mt-14 md:mx-28 font-poppins md:text-xl pt-5 text-center">
                   
Giveaways, Merchandise and “Nugz Companions” will be announced throughout the course of the Roadmap.  Please join our Discord and follow us on socials for regular updates                                        
                </div>
                {/* Info Text End */}
            </div>
        </div>
        {/* ROADMAP END */}

        {/* FAQ START */}
        <div id="faq" class="py-10">
            <div class="container mx-auto px-5 lg:px-0">
                {/* Title Start */}
                <div class="text-white text-3xl md:text-6xl 2xl:text-[110px] font-melon text-center big-title leading-none mb-14" data-aos="fade-down">FAQ</div>
                {/* Title End */}

                {/* List Start */}
                <div class="list">
                    {/* Faq Start */}
                    <div class="border border-customred faq open mb-10" data-aos="fade-left">
                        {/* Header Start */}
                        <div class="p-5 text-white text-shadow-sm font-montserrat md:text-2xl font-bold cursor-pointer select-none header">
                            <span class="rounded-md sm:py-2 sm:px-5 md:py-0 md:px-5 sm:bg-white sm:text-black mr-1 sm:mr-9">-</span>
                            WHAT IS NUGZ? 🌳
                        </div>
                        {/* Header End */}

                        {/* Content Start */}
                        <div class="text-white p-5 font-montserrat md:text-lg hidden content">
                            Nugz is a collection of 10,000 hand-drawn companions focused on giving back and creating an equal opportunity for all holders to yield strong returns on their investment.  Nugz NFTs are created and compiled of hundreds of traits and utilities. All Nugz are unique, Non-Fungible Tokens (NFTs) on the Ethereum Blockchain.                           
                        </div>
                        {/* Content End */}
                    </div>
                    {/* Faq End */}
                    {/* Faq Start */}
                    <div class="border border-customred faq mb-10" data-aos="fade-right">
                        {/* Header Start */}
                        <div class="p-5 text-white text-shadow-sm font-montserrat md:text-2xl font-bold cursor-pointer select-none header">
                            <span class="rounded-md sm:py-2 sm:px-5 md:py-0 md:px-5 sm:bg-white sm:text-black mr-1 sm:mr-9">+</span>
                          WHAT ARE THE UTILITIES?
                        </div>
                        {/* Header End */}

                        {/* Content Start */}
                        <div class="text-white p-5 font-montserrat md:selection:text-lg hidden content">
                            Passive Income (daily token rewards) 
                            <br/>Multiple play to earn games
                            <br/> MetaLand: clubhouse, activities, digitial dispensary, restaurant, Nugz shop, Scenery
                            <br/>Giveaways, merchandise, Nugz companions (3D printed Nugz figurines)
                            <br/>Percentage of every sale goes to the American Cancer Society.                          
                        </div>
                        {/* Content End */}
                    </div>
                    {/* Faq End */}
                    {/* Faq Start */}
                    <div class="border border-customred faq mb-10" data-aos="fade-right">
                        {/* Header Start */}
                        <div class="p-5 text-white text-shadow-sm font-montserrat md:text-2xl font-bold cursor-pointer select-none header">
                            <span class="rounded-md sm:py-2 sm:px-5 md:py-0 md:px-5 sm:bg-white sm:text-black mr-1 sm:mr-9">+</span>
                            WILL THERE BE A WHITELIST? 💎
                        </div>
                        {/* Header End */}

                        {/* Content Start */}
                        <div class="text-white p-5 font-montserrat md:selection:text-lg hidden content">
                            Yes. We will be hand-selecting our biggest supporters based on community activity & love for the project.  Please join our discord and follow us on social media for more information.                          
                        </div>
                        {/* Content End */}
                    </div>
                    {/* Faq End */}

                    {/* Faq Start */}
                    <div class="border border-customred faq mb-10" data-aos="fade-left">
                        {/* Header Start */}
                        <div class="p-5 text-white text-shadow-sm font-montserrat md:text-2xl font-bold cursor-pointer select-none header">
                            <span class="rounded-md sm:py-2 sm:px-5 md:py-0 md:px-5 sm:bg-white sm:text-black mr-1 sm:mr-9">+</span>
                            WHEN IS THE MINT DATE? 📅
                        </div>
                        {/* Header End */}

                        {/* Content Start */}
                        <div class="text-white p-5 font-montserrat md:text-lg hidden content">
                            WHITELIST PRESALE - TBA 
                            <br/>PUBLIC MINT - TBA                      
                        </div>
                        {/* Content End */}
                    </div>
                    {/* Faq End */}

                    {/* Faq Start */}
                    <div class="border border-customred faq mb-10" data-aos="fade-right">
                        {/* Header Start */}
                        <div class="p-5 text-white text-shadow-sm font-montserrat md:text-2xl font-bold cursor-pointer select-none header">
                            <span class="rounded-md sm:py-2 sm:px-5 md:py-0 md:px-5 sm:bg-white sm:text-black mr-1 sm:mr-9">+</span>
                            HOW MANY NUGZ CAN I MINT?
                        </div>
                        {/* Header End */}

                        {/* Content Start */}
                        <div class="text-white p-5 font-montserrat md:text-lg hidden content">
                            WHITELIST PRESALE - 3 Maximum per wallet. 
                            <br/> PUBLIC MINT - 5 Maximum per transaction.                       
                        </div>
                        {/* Content End */}
                    </div>
                    {/* Faq End */}

                    {/* Faq Start */}
                    <div class="border border-customred faq" data-aos="fade-left">
                        {/* Header Start */}
                        <div class="p-5 text-white text-shadow-sm font-montserrat md:text-2xl font-bold cursor-pointer select-none header">
                            <span class="rounded-md sm:py-2 sm:px-5 md:py-0 md:px-5 sm:bg-white sm:text-black mr-1 sm:mr-9">+</span>
                            WILL THERE BE MUTATION CAPABILITIES? 🔥
                        </div>
                        {/* Header End */}

                        {/* Content Start */}
                        <div class="text-white p-5 font-montserrat md:text-lg hidden content">
                            Yes. Holders will be able to "Roll-Up" their NUGZ to become a part of an exclusive & unique collection. More information to come. 
                            <br/> We will be announcing giveaways, rewards, and merch throughout the journey of this project.  Information on mining facility, future token implementation, MetaLand, and play to earn games to be announced.						   
                        </div>
                        {/* Content End */}
                    </div>
                    {/* Faq End */}
					
                </div>
                {/* List End */}
            </div>
        </div>
        {/* FAQ END */}

        {/* TEAM START */}
        <div id="team" class="py-10">
            <div class="container mx-auto">
                {/* Title Start */}
                <div class="text-white text-3xl md:text-6xl 2xl:text-[110px] font-melon text-center big-title leading-none mb-14" data-aos="fade-down">Team</div>
                {/* Title End */}    
                
                {/* Flex Start */}
                <div class="md:flex justify-center">
                    <div class="box mx-5 md:w-1/2 lg:w-1/3 mb-10 md:mb-0" data-aos="fade-right" data-aos-delay="250">
                        <div class="border-4 border-customred text-center p-5 mb-8">
                            <img class="max-h-80 h-80 inline-block" src="assets/img/team-1.png" alt=""/>
                        </div>

                        {/* Name Start */}
                        <div class="text-white font-poppins font-semibold text-xl xl:text-3xl text-center">@Mallard// Cody Smith</div>
                        {/* Name End */}

                        {/* Job Start */}
                        <div class="font-melon text-white text-lg text-center mt-2">✨ Our Creative Director and Founder. ✨</div>
                        {/* Job End */}

                        {/* Desc Start */}
                        <div class="font-poppins text-white xl:text-lg text-center mt-2">
                            Also known as Mallard in the community, Cody is an American based
                            entrepreneur & creative investor with 10+ years in cryptocurrencies.                                
                        </div>
                        {/* Desc End */}                        
                    </div>
                    <div class="box mx-5 md:w-1/2 lg:w-1/3" data-aos="fade-left" data-aos-delay="500">
                        <div class="border-4 border-customred text-center p-5 mb-8">
                            <img class="max-h-80 h-80 inline-block" src="assets/img/team-2.png" alt=""/>
                        </div>

                        {/* Name Start */}
                        <div class="text-white font-poppins font-semibold text-xl xl:text-3xl text-center">@Germ // Nick Germano</div>
                        {/* Name End */}

                        {/* Job Start */}
                        <div class="font-melon text-white text-lg text-center mt-2">✨ Co-Founder & Community Manager. ✨</div>
                        {/* Job End */}

                        {/* Desc Start */}
                        <div class="font-poppins text-white xl:text-lg text-center mt-2">
                            Also known as Mallard in the community, Cody is an American based
                            entrepreneur & creative investor with 10+ years in cryptocurrencies.                                
                        </div>
                        {/* Desc End */}                        
                    </div>
                </div>
                {/* Flex End */}
            </div>
        </div>
        {/* TEAM END */}

        {/* FOOTER START */}
        <footer id="footer" class="lg:-mt-20 xl:-mt-52">-
            <img src="assets/img/footer-img.png" class="w-full hidden lg:block" alt="" data-aos="fade-down"/>
            <div class="bg-black py-10">
                <div class="container mx-auto">
                    {/* Copyright Start */}
                    <div class="text-white text-opacity-50 text-center">Copyright © 2022 Nugz NFT - All Rights Reserved | Privacy Policy</div>
                    {/* Copyright End */}
    
                    {/* Social Start */}
                    <ul class="flex mt-3 justify-center">
                        <li>
                            <a class="p-2 block" href="https://www.instagram.com/nugznftofficial/">
                                <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.6514 7.78125C10.2628 7.78125 7.45508 10.4371 7.45508 13.7454C7.45508 17.0536 10.2144 19.7095 13.6514 19.7095C17.0884 19.7095 19.8477 17.007 19.8477 13.7454C19.8477 10.4837 17.04 7.78125 13.6514 7.78125ZM13.6514 17.5661C11.473 17.5661 9.68188 15.8421 9.68188 13.7454C9.68188 11.6486 11.473 9.92461 13.6514 9.92461C15.8298 9.92461 17.6209 11.6486 17.6209 13.7454C17.6209 15.8421 15.8298 17.5661 13.6514 17.5661Z" fill="white"/>
                                    <path d="M20.0898 8.99253C20.8651 8.99253 21.4936 8.38756 21.4936 7.64128C21.4936 6.89501 20.8651 6.29004 20.0898 6.29004C19.3144 6.29004 18.6859 6.89501 18.6859 7.64128C18.6859 8.38756 19.3144 8.99253 20.0898 8.99253Z" fill="white"/>
                                    <path d="M23.7204 4.14671C22.4618 2.88865 20.6707 2.23633 18.6375 2.23633H8.66528C4.45371 2.23633 1.646 4.93882 1.646 8.99256V18.5445C1.646 20.548 2.32372 22.2721 3.67917 23.5301C4.9862 24.7416 6.72892 25.3473 8.71368 25.3473H18.5891C20.6707 25.3473 22.4134 24.695 23.672 23.5301C24.979 22.3186 25.6568 20.5946 25.6568 18.5911V8.99256C25.6568 7.03558 24.979 5.35817 23.7204 4.14671ZM23.5268 18.5911C23.5268 20.0355 22.9943 21.2004 22.1229 21.9925C21.2516 22.7846 20.0413 23.2039 18.5891 23.2039H8.71368C7.26142 23.2039 6.0512 22.7846 5.17984 21.9925C4.30848 21.1538 3.8728 19.9889 3.8728 18.5445V8.99256C3.8728 7.59472 4.30848 6.42985 5.17984 5.59115C6.00279 4.79904 7.26142 4.37968 8.71368 4.37968H18.6859C20.1382 4.37968 21.3484 4.79904 22.2197 5.63774C23.0427 6.47645 23.5268 7.64131 23.5268 8.99256V18.5911Z" fill="white"/>
                                </svg>                                        
                            </a>
                        </li>
                        <li>
                            <a class="p-2 block" href="https://twitter.com/NugzNFTs">
                                <svg width="27" height="22" viewBox="0 0 27 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.2564 2.93264C25.2955 3.35292 24.2613 3.63641 23.1761 3.76327C24.2841 3.11067 25.1336 2.07695 25.5342 0.843792C24.4979 1.44889 23.3507 1.88796 22.1286 2.12498C21.1507 1.09961 19.7567 0.458496 18.2141 0.458496C15.2526 0.458496 12.8515 2.82092 12.8515 5.73518C12.8515 6.14814 12.8987 6.55067 12.9905 6.93753C8.5332 6.71721 4.58103 4.61688 1.9358 1.42435C1.47415 2.20329 1.20989 3.10963 1.20989 4.07757C1.20989 5.90799 2.15655 7.52331 3.59563 8.46932C2.7169 8.44165 1.88964 8.2041 1.16638 7.80889C1.16585 7.83081 1.16585 7.85326 1.16585 7.87571C1.16585 10.4318 3.01459 12.564 5.46825 13.0495C5.01827 13.1696 4.54441 13.2344 4.05516 13.2344C3.70919 13.2344 3.3733 13.2015 3.04589 13.1393C3.72882 15.2355 5.70916 16.7615 8.05563 16.8038C6.22016 18.2192 3.90818 19.0629 1.39509 19.0629C0.962618 19.0629 0.535456 19.0378 0.115723 18.9887C2.48979 20.4866 5.30853 21.3595 8.33687 21.3595C18.2019 21.3595 23.5958 13.3195 23.5958 6.34653C23.5958 6.11786 23.5911 5.88971 23.581 5.66313C24.6285 4.92073 25.538 3.9909 26.2564 2.93264Z" fill="white"/>
                                </svg>                                                                          
                            </a>
                        </li>
                        <li>
                            <a class="p-2 block" href="https://discord.gg/nugz">
                                <svg width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M26.3843 3.93675C26.3764 3.9221 26.3632 3.91063 26.3472 3.90437C24.4931 3.09531 22.5365 2.51838 20.5264 2.18803C20.5081 2.1848 20.4892 2.18713 20.4724 2.19469C20.4557 2.20224 20.4418 2.21464 20.4328 2.23012C20.1664 2.69003 19.9246 3.16244 19.7082 3.64553C17.5414 3.3327 15.3373 3.3327 13.1705 3.64553C12.9527 3.16121 12.707 2.68869 12.4345 2.23012C12.4251 2.21498 12.4112 2.20287 12.3945 2.19536C12.3778 2.18785 12.3591 2.1853 12.3409 2.18803C10.3305 2.51769 8.37382 3.09466 6.51998 3.90442C6.50411 3.91082 6.49072 3.92174 6.48165 3.93569C2.77434 9.20128 1.75876 14.3374 2.25697 19.4099C2.25837 19.4224 2.26239 19.4344 2.26878 19.4453C2.27517 19.4563 2.2838 19.4658 2.29417 19.4735C4.45291 20.9937 6.86748 22.1541 9.43485 22.9052C9.45293 22.9103 9.47224 22.9101 9.49018 22.9045C9.50812 22.8989 9.52382 22.8882 9.53519 22.8739C10.0866 22.1603 10.5752 21.4047 10.996 20.6147C11.0018 20.6039 11.0051 20.592 11.0057 20.5798C11.0063 20.5677 11.0042 20.5556 10.9995 20.5443C10.9948 20.5329 10.9877 20.5227 10.9785 20.5142C10.9694 20.5057 10.9584 20.4992 10.9464 20.495C10.176 20.2146 9.43005 19.8766 8.7157 19.4842C8.70273 19.4769 8.69183 19.4667 8.68397 19.4545C8.67611 19.4423 8.67154 19.4284 8.67065 19.4142C8.66976 19.3999 8.67258 19.3856 8.67887 19.3726C8.68516 19.3596 8.69472 19.3482 8.70671 19.3396C8.8566 19.2328 9.00658 19.1217 9.14971 19.0095C9.16243 18.9995 9.17782 18.9931 9.19414 18.991C9.21047 18.9889 9.22708 18.9912 9.24212 18.9976C13.9221 21.029 18.9889 21.029 23.6135 18.9976C23.6285 18.9908 23.6453 18.9882 23.6619 18.9901C23.6784 18.992 23.6941 18.9984 23.707 19.0084C23.8502 19.1206 24.0001 19.2328 24.1512 19.3396C24.1632 19.3481 24.1728 19.3594 24.1792 19.3724C24.1856 19.3853 24.1886 19.3996 24.1878 19.4139C24.187 19.4282 24.1825 19.4421 24.1748 19.4543C24.167 19.4666 24.1562 19.4768 24.1433 19.4842C23.4305 19.8799 22.684 20.2177 21.9115 20.4939C21.8995 20.4983 21.8886 20.505 21.8795 20.5136C21.8704 20.5222 21.8633 20.5326 21.8587 20.544C21.8541 20.5554 21.8521 20.5676 21.8528 20.5797C21.8535 20.5919 21.8569 20.6038 21.8628 20.6147C22.2907 21.4003 22.7786 22.155 23.3225 22.8726C23.3336 22.8874 23.3492 22.8984 23.3672 22.9042C23.3852 22.91 23.4047 22.9103 23.4229 22.905C25.9948 22.1565 28.4136 20.996 30.5751 19.4735C30.5856 19.4662 30.5944 19.4569 30.6008 19.4461C30.6072 19.4353 30.6111 19.4233 30.6123 19.411C31.2087 13.5466 29.6137 8.4526 26.3843 3.93675ZM11.6949 16.3213C10.2859 16.3213 9.12491 15.0915 9.12491 13.5812C9.12491 12.0709 10.2634 10.841 11.6949 10.841C13.1377 10.841 14.2874 12.0815 14.2649 13.5811C14.2649 15.0915 13.1264 16.3213 11.6949 16.3213ZM21.197 16.3213C19.7881 16.3213 18.6271 15.0915 18.6271 13.5812C18.6271 12.0709 19.7655 10.841 21.197 10.841C22.6399 10.841 23.7896 12.0815 23.767 13.5811C23.767 15.0915 22.6399 16.3213 21.197 16.3213Z" fill="white"/>
                                </svg>                                                                                                              
                            </a>
                        </li>
                    </ul>
                    {/* Social End */}                
                </div>
            </div>
        </footer>
        {/* FOOTER END */}
    </div>
  );
}

export default App;
