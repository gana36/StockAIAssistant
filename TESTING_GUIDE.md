# Stock AI Assistant - Complete Testing Guide

## 🚀 Quick Start Testing

### Prerequisites Checklist
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] API keys configured in `backend/.env`
  - [ ] SERPER_API_KEY
  - [ ] OPENAI_API_KEY
  - [ ] AGENTOPS_API_KEY (optional)

---

## 📋 Step-by-Step Testing

### Step 1: Start the Backend

```bash
# Terminal 1: Start Flask Backend
cd backend
python run.py
```

**Expected Output:**
```
✅ All required environment variables are set.
🚀 Starting Stock Analyzer API Server...
📍 Server URL: http://localhost:5000
🏥 Health Check: http://localhost:5000/
 * Running on http://0.0.0.0:5000
```

**✅ Verification:**
```bash
# In a new terminal
curl http://localhost:5000/

# Should return:
{
  "status": "healthy",
  "message": "Stock Analyzer API is running",
  "version": "1.0.0"
}
```

---

### Step 2: Start the Frontend

```bash
# Terminal 2: Start React Frontend
npm install  # First time only
npm run dev
```

**Expected Output:**
```
  VITE v6.3.5  ready in 523 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**✅ Verification:**
- Browser should auto-open to http://localhost:3000
- You should see the dark themed Stock Analysis Dashboard
- No console errors in browser DevTools

---

### Step 3: Test Stock Data Fetching

**Action:**
1. Type "AAPL" in the search bar
2. Click Search button or press Enter

**Expected Results:**
- ✅ Loading skeleton appears
- ✅ Stock info card populates with:
  - Company name: "Apple Inc."
  - Current stock price
  - Change (+/- green/red)
  - Volume, Market Cap, 52W High/Low
- ✅ Toast notification: "Successfully loaded data for AAPL"
- ✅ Chart and Data Table tabs show data

**Console Logs to Check:**
```
Creating new sentiment crew (first time only)...
Creating new technical crew (first time only)...
Creating new quantitative crew (first time only)...
Creating new risk crew (first time only)...
```

---

### Step 4: Test Full Analysis

**Action:**
1. With stock loaded (e.g., AAPL)
2. Click "Run Full Analysis" button in sidebar

**Expected Results:**
- ✅ Progress spinner appears
- ✅ Toast notification: "Running comprehensive analysis..."
- ✅ Wait 30-120 seconds (normal for AI analysis)
- ✅ Analysis Status sidebar shows:
  - Sentiment Analysis: ✅ Completed
  - Technical Analysis: ✅ Completed
  - Quantitative Analysis: ✅ Completed
  - Risk Assessment: ✅ Completed
- ✅ Toast notification: "Analysis completed!"

**Verify Analysis Content:**
1. Click "Sentiment" tab → Should show AI-generated text analysis
2. Click "Technical" tab → Should show trading signals and indicators
3. Click "Quantitative" tab → Should show statistical analysis
4. Click "Risk" tab → Should show risk assessment

**Backend Console Should Show:**
```
Creating new sentiment crew (first time only)...
Starting sentiment analysis for AAPL
Starting technical analysis for AAPL
Starting quantitative analysis for AAPL
Starting risk assessment for AAPL
```

**Note:** Subsequent runs should NOT show "Creating new crew" (cached!)

---

### Step 5: Test AI Chat

**Action:**
1. With stock loaded and analysis complete
2. Type in chat: "Should I buy this stock?"
3. Press Enter or click Send

**Expected Results:**
- ✅ User message appears on right (blue)
- ✅ "AI is thinking..." spinner appears
- ✅ Wait 5-15 seconds
- ✅ AI response appears on left (glass-morph card)
- ✅ Response references preloaded analysis data

**Test More Questions:**
- "What are the main risks?"
- "What's the technical outlook?"
- "Is the sentiment positive?"
- "What's the price target?"

**Backend Console Should Show:**
```
Starting chat analysis for AAPL: Should I buy this stock?
Using chat crew...
```

---

### Step 6: Test Different Stocks

**Test These Stocks:**

**1. TSLA (Tesla)**
```
Search: TSLA
✅ Data loads
✅ Run Full Analysis
✅ All 4 analyses complete
✅ Chat works
```

**2. MSFT (Microsoft)**
```
Search: MSFT
✅ Data loads
✅ Run Full Analysis
✅ All 4 analyses complete
```

**3. GOOGL (Google)**
```
Search: GOOGL
✅ Data loads
✅ Run Full Analysis
```

---

### Step 7: Test Error Handling

**Test Invalid Stock:**
```
Search: INVALIDTICKER123
❌ Should show error toast
✅ Returns to empty state
```

**Test Without Backend Running:**
```
Stop backend (Ctrl+C in Terminal 1)
Search: AAPL
❌ Should show error toast: "Failed to fetch stock data"
✅ Frontend doesn't crash
```

**Test Chat Without Stock:**
```
Don't select a stock
Try to chat
❌ Should show: "Please select a stock first"
✅ Input disabled
```

---

## 🧪 Advanced Testing

### Test Crew Caching

**Verify crews are cached properly:**

1. First request for AAPL:
```bash
# Backend console should show:
Creating new sentiment crew (first time only)...
Creating new technical crew (first time only)...
...
```

2. Second request for TSLA:
```bash
# Backend console should NOT show "Creating new crew"
# Should reuse existing crews (faster!)
```

**Performance Check:**
- First full analysis: ~90-120 seconds
- Subsequent analyses: ~60-90 seconds (40-50% faster!)

---

### Test API Endpoints Directly

**Stock Data:**
```bash
curl "http://localhost:5000/api/stock-data?ticker=AAPL"
# Should return JSON with stock data
```

**Sentiment Analysis:**
```bash
curl -X POST http://localhost:5000/api/sentiment-analysis \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL"}'
# Should return analysis (takes 20-30s)
```

**Chat API:**
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL","question":"What is the outlook?"}'
# Should return AI response
```

---

## 🐛 Troubleshooting Common Issues

### Issue: Backend won't start

**Symptom:** `ModuleNotFoundError` or import errors

**Solution:**
```bash
cd backend
pip install -r requirements.txt
python run.py
```

---

### Issue: Frontend shows CORS errors

**Symptom:** Browser console shows CORS policy errors

**Solution:**
1. Check backend is running on port 5000
2. Verify `vite.config.ts` has proxy configuration
3. Restart both servers

---

### Issue: Analysis takes too long / times out

**Symptom:** Analysis runs for 2+ minutes then fails

**Solution:**
1. Check your OpenAI API key is valid
2. Check your Serper API key is valid
3. Check internet connection
4. Increase timeout in `app.py` (line 256, 297, 338, 379):
```python
result = future.result(timeout=180)  # Increase to 180s
```

---

### Issue: Chat doesn't work

**Symptom:** Chat sends message but no response

**Solution:**
1. Check browser console for errors
2. Verify a stock is selected
3. Check backend logs for errors
4. Verify chat crew is created:
```bash
# Backend console should show:
Creating new chat crew (first time only)...
```

---

### Issue: Stock data shows $0.00 or weird values

**Symptom:** Price shows as $0.00 or NaN

**Solution:**
1. Check the ticker symbol is valid
2. Try a different stock (e.g., AAPL, MSFT)
3. Check yfinance API is accessible:
```python
import yfinance as yf
stock = yf.Ticker("AAPL")
print(stock.info)
```

---

## ✅ Final Verification Checklist

**Backend:**
- [ ] Flask server starts without errors
- [ ] Health check endpoint responds
- [ ] All 5 crews created on first use
- [ ] Crews are cached (not recreated each time)
- [ ] Stock data API works
- [ ] All 4 analysis endpoints work
- [ ] Chat API works

**Frontend:**
- [ ] React app loads without errors
- [ ] Search functionality works
- [ ] Stock info displays correctly
- [ ] Tabs switch properly
- [ ] "Run Full Analysis" button works
- [ ] All 4 analysis tabs populate with AI results
- [ ] Chat interface sends/receives messages
- [ ] Analysis Status updates in real-time
- [ ] Toast notifications appear
- [ ] Loading states show correctly

**Integration:**
- [ ] Frontend connects to backend
- [ ] API calls succeed
- [ ] Real data appears in UI
- [ ] Crew caching improves performance
- [ ] Error handling works properly
- [ ] Multiple stocks can be analyzed
- [ ] Chat uses preloaded analysis context

---

## 📊 Performance Benchmarks

**Expected Timings:**

| Operation | First Time | Subsequent | Target |
|-----------|-----------|------------|---------|
| Stock Data Fetch | 2-3s | 2-3s | < 5s |
| Sentiment Analysis | 20-30s | 15-20s | < 30s |
| Technical Analysis | 20-30s | 15-20s | < 30s |
| Quantitative Analysis | 20-30s | 15-20s | < 30s |
| Risk Assessment | 20-30s | 15-20s | < 30s |
| Full Analysis | 90-120s | 60-90s | < 120s |
| Chat Response | 10-15s | 8-12s | < 20s |

**Crew Creation (First Time Only):**
- Each crew: ~0.5-1s
- All 5 crews: ~3-5s total

---

## 🎉 Success Criteria

Your integration is **fully working** if:

✅ Both servers start without errors
✅ You can search and load stock data
✅ Full analysis completes successfully
✅ All 4 analysis tabs show AI-generated content
✅ Chat responds to questions
✅ Subsequent requests are faster (cached crews)
✅ No CORS errors in browser
✅ Toast notifications work
✅ UI updates in real-time

---

## 📝 Next Steps After Testing

Once all tests pass:

1. **Optimize Performance:**
   - Add response caching (Redis)
   - Implement request queuing
   - Add rate limiting

2. **Enhance UI:**
   - Add chart visualizations
   - Parse structured analysis data
   - Add more interactive elements

3. **Deploy:**
   - Backend: Railway, Render, or AWS
   - Frontend: Vercel, Netlify
   - Configure production environment variables

4. **Monitor:**
   - Set up AgentOps dashboard
   - Add error tracking (Sentry)
   - Monitor API costs

---

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check browser console for errors
2. Check backend terminal for errors
3. Verify all environment variables are set
4. Review `INTEGRATION_GUIDE.md`
5. Check Flask logs for detailed error messages

**Common Log Locations:**
- Frontend errors: Browser DevTools → Console
- Backend errors: Terminal running `python run.py`
- Network errors: Browser DevTools → Network tab

---

## 🎯 Quick Test Script

Copy and run this to test everything at once:

```bash
# Test Backend
echo "Testing backend health..."
curl http://localhost:5000/

echo "\nTesting stock data..."
curl "http://localhost:5000/api/stock-data?ticker=AAPL"

echo "\nAll manual tests passed! Check browser for frontend tests."
```

**Expected:** All commands return JSON without errors.

---

**You're all set! Happy testing! 🚀**
