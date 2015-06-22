package api

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type JaccedeRequest interface {
	GetRequestUrl() url.URL
}

type SearchRequest struct {
	what      string
	where     string
	category  int
	offset    uint64
	limit     uint64
	distance  float64
	latitude  float64
	longitude float64
}

func NewSearchRequest() *SearchRequest {
	return new(SearchRequest)
}

func (request *SearchRequest) SetSearchQuery(what string,
	where string,
	category int) {
	request.what = what
	request.where = where
	request.category = category
}

func (request *SearchRequest) SetSearchLocation(latitude, longitude float64, distance float64) {
	request.latitude = latitude
	request.longitude = longitude
	request.distance = distance
}

func (request *SearchRequest) SetSearchParameters(offset, limit uint64) {
	request.offset = offset
	request.limit = limit
}

func (request *SearchRequest) GetRequestUrl() url.URL {
	v := url.Values{}
	if len(request.what) != 0 {
		v.Add("what", request.what)
	}
	if len(request.where) != 0 {
		v.Add("where", request.where)
	}
	if request.category != -1 {
		v.Add("cat_id", strconv.Itoa(request.category))
	}
	v.Add("offset", strconv.FormatUint(request.offset, 10))
	v.Add("limit", strconv.FormatUint(request.limit, 10))
	v.Add("distance", strconv.FormatFloat(request.distance, 'f', -1, 32))
	v.Add("latitude", strconv.FormatFloat(request.latitude, 'f', -1, 32))
	v.Add("longitude", strconv.FormatFloat(request.longitude, 'f', -1, 32))

	u := url.URL{
		Scheme:   "http",
		Host:     "api3.jaccede.com",
		Path:     "/v3/places/search/",
		RawQuery: v.Encode(),
	}
	return u
}

type JaccedeResponse struct {
	Response *http.Response
}

type JaccedeClient struct {
	httpClient *http.Client
}

func NewClient() JaccedeClient {
	return JaccedeClient{httpClient: &http.Client{}}
}

func NewClientWithHttp(client *http.Client) JaccedeClient {
	return JaccedeClient{httpClient: client}
}

func (client *JaccedeClient) SendRequest(request JaccedeRequest) *JaccedeResponse {
	url := request.GetRequestUrl()
	httpRequest, err := http.NewRequest("GET", url.String(), nil)
	if err != nil {
		panic(err)
	}

	httpRequest.Header = client.computeHeader(&url, time.Now())
	response, err := client.httpClient.Do(httpRequest)
	if err != nil {
		panic(err)
	}
	return &JaccedeResponse{Response: response}
}

func (client *JaccedeClient) computeHeader(url *url.URL, t time.Time) http.Header {
	key_id := "test-jispapi-access-key-id"
	secret_key := []byte("test-jispapi-secret-access-key")
	now_secs := t.Unix()
	string_to_sign := strings.Join([]string{"GET",
		"x-jispapi-timestamp:" + strconv.FormatInt(now_secs, 10),
		url.Path}, "\n")
	hasher := hmac.New(sha1.New, secret_key)
	io.WriteString(hasher, string_to_sign)
	var hexHash string = fmt.Sprintf("%x", hasher.Sum(nil))
	var b64_signature string = base64.StdEncoding.EncodeToString([]byte(hexHash))
	var headers http.Header = make(http.Header)
	headers.Add("x-jispapi-timestamp", fmt.Sprintf("%d", now_secs))
	headers.Add("Authorization",
		fmt.Sprintf("JISPAPI %s:%s", key_id, b64_signature))
	return headers
}
